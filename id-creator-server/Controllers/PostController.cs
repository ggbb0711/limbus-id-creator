using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Server.DTOs.Requests.Post;
using Server.DTOs.Response.Post;
using Server.Interface.ServiceInterface.CommentService;
using Server.Interface.ServiceInterface.IPostService;
using Server.Interface.UtilInterfaces;
using Server.Models;
using Server.PostViewService;
using Server.Util.ApiException;
using Server.Util.Enums;
using Server.Util.Obj;
using Sprache;

namespace Server.Controllers
{
    [Route("API/[controller]")]
    [EnableCors("AllowOrigin")]
    public class PostController(IPostService postService,IPostViewService postViewService, ICommentService commentService, IMapper mapper):Controller
    {

        [HttpPost("")]
        [EnableCors("AllowOrigin")]
        [Authorize]
        public async Task<ActionResult<PostResponseDTO>> CreateNewPost([FromBody] PostRequestDTO newPost)
        {
            //TODO: Add validator to check for title must be <200 characters
            // Images must be between 1 and 8 images
            // Post must hav less than 22 tags
            var sub = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (!Guid.TryParse(sub, out var userId))
                throw new UnauthorizedException("Invalid access token");
            var post = mapper.Map<Post>(newPost);
            post.UserId = userId;
            var addedPost = await postService.CreatePost(post);
            return Ok(ApiResponse<PostResponseDTO>.Ok(mapper.Map<PostResponseDTO>(addedPost),"Post created successfully"));
        }

        [HttpGet("{PostId}")]
        public async Task<ActionResult<PostResponseDTO>> GetPost(Guid postId)
        {
            var sub = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            _ = Guid.TryParse(sub, out var userId);
            
            var foundPost = await postService.GetPostById(postId);
            var postResponse = mapper.Map<PostResponseDTO>(foundPost);
            postResponse.ViewCount = await postViewService.LogView(new PostView()
            {
                Id = Guid.NewGuid(),
                PostId = postResponse.Id,
                UserId = userId
            });
            postResponse.CommentCount = commentService.GetCommentCount(postResponse.Id);
            return Ok(ApiResponse<PostResponseDTO>.Ok(postResponse));
        }

        [HttpGet("")]
        public async Task<ActionResult<PostListResponseDTO>> GetPosts([FromQuery] SearchPostOption option)
        {
            var foundPost = await postService.FindPosts(option);
            var postListResponse = new PostListResponseDTO()
            {
                List = [.. foundPost.Select(p=>
                {
                    var postResponse = mapper.Map<PostResponseDTO>(p);
                    postResponse.ViewCount = postViewService.GetViewCount(postResponse.Id);
                    postResponse.CommentCount = commentService.GetCommentCount(postResponse.Id);
                    return postResponse;
                })],
                Total = postService.GetPostCount(option)
            };
            return Ok(ApiResponse<PostListResponseDTO>.Ok(postListResponse));
        }
    }   
}