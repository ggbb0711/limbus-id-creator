using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using RepositoryLayer.Models;
using RepositoryLayer.Utils.Obj;
using ServiceLayer.DTOs.Request.Post;
using ServiceLayer.DTOs.Response.Post;
using ServiceLayer.Interfaces.CommentService;
using ServiceLayer.Interfaces.IPostService;
using ServiceLayer.Interfaces.PostViewService;
using ServiceLayer.Services.UtilServices;
using Sprache;

namespace Server.Controllers
{
    [Route("API/[controller]")]
    [EnableCors("AllowOrigin")]
    public class PostController(IPostService postService,IPostViewService postViewService, ICommentService commentService, IMapper mapper):Controller
    {
        private readonly IPostService _postService = postService;
        private readonly IPostViewService _postViewService = postViewService;
        private readonly ICommentService _commentService = commentService;
        private readonly IMapper _mapper =mapper; 

        [HttpPost("create")]
        [EnableCors("AllowOrigin")]
        public async Task<IActionResult> CreateNewPost([FromBody] PostRequestDTO newPost)
        {
            var response = new ResponseService<PostResponseDTO>();
            var session = (Session?) HttpContext.Items["Session"];

            if(session == null)
            {
                response.msg= "Unauthorized";
                return StatusCode(401,response);
            }

            if(newPost.title.IsNullOrEmpty()||newPost.title.Length>200)
            {
                response.msg = "Title is required and must be less than 200";
                return BadRequest(response);
            }

            if(newPost.imagesAttach.Count()<1||newPost.imagesAttach.Count()>8)
            {
                response.msg = "Post must contain between 1 and 8 images";
                return BadRequest(response);
            }

            if(newPost.tags.Count()>22)
            {
                response.msg = "Post must have less than 22 tags";
                return BadRequest(response);
            }

            try
            {
                var existedPost = await _postService.FindPostById(newPost.id);
                if(existedPost!=null)
                {
                    response.msg = "Post id has already existed";
                    return BadRequest(response);
                }
                var createdPost = await _postService.CreatePost(_mapper.Map<PostRequestDTO,Post>(newPost));
                if(createdPost == null)
                {
                    response.msg = "Cannot create post";
                    return BadRequest(response);
                }
                response.Response = _mapper.Map<Post,PostResponseDTO>(createdPost);
                response.msg = "Post created successfully";
                return Ok(response);
            }
            catch (System.Exception ex)
            {
                response.msg="Something went wrong with the server";
                Console.WriteLine(ex);
                return StatusCode(500,response);
            }
        }

        [HttpGet("{PostId}")]
        public async Task<IActionResult> GetPost(Guid PostId)
        {
            var response = new ResponseService<PostResponseDTO>();
            var session = (Session?) HttpContext.Items["Session"];

            
            try
            {
                var foundPost = await _postService.FindPostById(PostId);
                if(foundPost==null)
                {
                    response.msg = "There is no post with that id";
                    return Ok(response);
                }
                var postResponse = _mapper.Map<Post, PostResponseDTO>(foundPost);
                postResponse.viewCount = await _postViewService.LogView(new PostView()
                {
                    Id = Guid.NewGuid(),
                    PostId = postResponse.id,
                    UserId = (session==null)? null:session.UserId
                });
                postResponse.commentCount = _commentService.GetCommentCount(postResponse.id);
                response.msg="Found post";
                response.Response = postResponse;
                return Ok(response);
            }
            catch (System.Exception ex)
            {
                response.msg="Something went wrong with the server";
                Console.WriteLine(ex);
                return StatusCode(500,response);
            }
        }

        [HttpGet("")]
        public async Task<IActionResult> GetPosts([FromQuery] string Title = "",
        [FromQuery] string Tag="",
        [FromQuery] string UserId = "",
        [FromQuery] bool IncludeComment = false,
        [FromQuery] string SortedBy = "",
        [FromQuery] int page = 0,
        [FromQuery] int limit = 10)
        {
            var response = new ResponseService<PostListResponseDTO>();

            try
            {
                var option = new SearchPostOption()
                {
                    Title = Title,
                    Tag = (Tag.IsNullOrEmpty())?[]:Tag.Split(",").ToList(),
                    UserId = UserId,
                    IncludeComment = IncludeComment,
                    SortedBy = SortedBy,
                    page = page,
                    limit = limit,
                };
                var foundPost = await _postService.FindPosts(option);
                var postListResponse = new PostListResponseDTO()
                {
                    list = foundPost.Select(p=>
                    {
                        var postResponse = _mapper.Map<Post,PostResponseDTO>(p);
                        postResponse.viewCount = _postViewService.GetViewCount(postResponse.id);
                        postResponse.commentCount = _commentService.GetCommentCount(postResponse.id);
                        return postResponse;
                    }).ToList(),
                    total = _postService.GetPostCount(option)
                };
                response.Response = postListResponse;
                return Ok(response);
            }
            catch (System.Exception ex)
            {
                response.msg="Something went wrong with the server";
                Console.WriteLine(ex);
                return StatusCode(500,response);
            }
        }
    }   
}