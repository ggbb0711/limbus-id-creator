using Server.Shared.Authorization;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Server.Features.Comment.Service;
using Server.Features.Post.DTO;
using Server.Features.Post.Repository;
using Server.Features.Post.Service;
using Server.Shared.Exception;
using Server.Shared.Filter;
using Server.Shared.Http;
using Server.Shared.Model;

namespace Server.Features.Post
{
    [Route("API/[controller]")]
    [EnableCors("AllowOrigin")]
    public class PostController(IPostService postService,IPostViewService postViewService, ICommentService commentService, IPostCardBuilder postCardBuilder, IMapper mapper):Controller
    {

        [HttpPost("")]
        [EnableCors("AllowOrigin")]
        [Authorize]
        [ValidationFilter<PostRequestDTO>]
        public async Task<ActionResult<PostResponseDTO>> CreateNewPost([FromBody] PostRequestDTO newPost)
        {
            var userId = User.GetRequiredUserId();
            var post = mapper.Map<PostModel>(newPost);
            post.UserId = userId;
            var cards = await postCardBuilder.BuildAsync(userId, newPost.Cards);
            post.Cards = cards;
            post.ImageAttaches = [.. cards.Select(c => new ImageObj { Url = c.ImageUrl })];
            var addedPost = await postService.CreatePost(post);
            return Ok(ApiResponse<PostResponseDTO>.Ok(mapper.Map<PostResponseDTO>(addedPost),"Post created successfully"));
        }

        [HttpGet("{PostId}")]
        public async Task<ActionResult<PostResponseDTO>> GetPost(Guid postId)
        {
            User.TryGetUserId(out var userId);
            
            var foundPost = await postService.GetPostById(postId)
                ?? throw new NotFoundException(ApiErrors.PostNotFound);
            if (foundPost.IsHidden())
                throw new GoneException(ApiErrors.PostRemoved);
            if (foundPost.User?.IsBanned() == true)
                throw new GoneException(ApiErrors.PostAuthorBanned);
            var postResponse = mapper.Map<PostResponseDTO>(foundPost);
            postResponse.Cards = mapper.Map<List<PostCardResponseDTO>>(foundPost.Cards.OrderBy(c => c.Position).ToList());
            postResponse.HasCards = foundPost.Cards.Count > 0;
            postResponse.ViewCount = await postViewService.LogView(new PostView()
            {
                PostId = postResponse.Id,
                UserId = userId
            });
            postResponse.CommentCount = commentService.GetCommentCount(postResponse.Id);
            return Ok(ApiResponse<PostResponseDTO>.Ok(postResponse));
        }

        [HttpPut("{PostId}")]
        [EnableCors("AllowOrigin")]
        [Authorize]
        [ValidationFilter<PostUpdateRequestDTO>]
        public async Task<ActionResult<PostResponseDTO>> UpdatePost(Guid postId, [FromBody] PostUpdateRequestDTO body)
        {
            var userId = User.GetRequiredUserId();
            var post = await FindOwnedPost(postId, userId);
            var cards = new List<PostCard>();
            foreach (var request in body.Cards)
            {
                if (request.CardId is Guid cardId)
                {
                    cards.Add(post.Cards.FirstOrDefault(c => c.Id == cardId)
                        ?? throw new BadRequestException(ApiErrors.PostCardNotFound));
                    continue;
                }
                var built = await postCardBuilder.BuildAsync(userId, [new PostCardRequestDTO { SaveId = request.SaveId!.Value, Kind = request.Kind!.Value }]);
                cards.Add(built[0]);
            }
            var updated = await postService.UpdatePost(post, body.Description, body.Tags, cards);
            var response = mapper.Map<PostResponseDTO>(updated);
            response.Cards = mapper.Map<List<PostCardResponseDTO>>(updated.Cards.OrderBy(c => c.Position).ToList());
            response.HasCards = updated.Cards.Count > 0;
            return Ok(ApiResponse<PostResponseDTO>.Ok(response, "Post updated successfully"));
        }

        [HttpDelete("{PostId}")]
        [EnableCors("AllowOrigin")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<Guid>>> DeletePost(Guid postId)
        {
            var post = await FindOwnedPost(postId, User.GetRequiredUserId());
            await postService.RemovePost(post);
            return Ok(ApiResponse<Guid>.Ok(post.Id, "Post deleted successfully"));
        }

        private async Task<PostModel> FindOwnedPost(Guid postId, Guid userId)
        {
            var post = await postService.GetPostById(postId)
                ?? throw new NotFoundException(ApiErrors.PostNotFound);
            if (post.IsHidden())
                throw new GoneException(ApiErrors.PostRemoved);
            if (post.UserId != userId)
                throw new ForbiddenException(ApiErrors.ResourceNotOwned);
            return post;
        }

        [HttpGet("")]
        public async Task<ActionResult<PostListResponseDTO>> GetPosts([FromQuery] SearchPostOption option)
        {
            var foundPost = await postService.FindPosts(option);
            var withCards = await postService.GetPostIdsWithCards([.. foundPost.Select(p => p.Id)]);
            var postListResponse = new PostListResponseDTO()
            {
                List = [.. foundPost.Select(p=>
                {
                    var postResponse = mapper.Map<PostResponseDTO>(p);
                    postResponse.ViewCount = postViewService.GetViewCount(postResponse.Id);
                    postResponse.CommentCount = commentService.GetCommentCount(postResponse.Id);
                    postResponse.HasCards = withCards.Contains(postResponse.Id);
                    return postResponse;
                })],
                Total = postService.GetPostCount(option)
            };
            return Ok(ApiResponse<PostListResponseDTO>.Ok(postListResponse));
        }
    }   
}