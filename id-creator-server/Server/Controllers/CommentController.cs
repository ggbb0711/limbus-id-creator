

using AutoMapper;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using RepositoryLayer.Models;
using RepositoryLayer.Utils.Obj;
using ServiceLayer.DTOs.Request.Comment;
using ServiceLayer.DTOs.Response.Comment;
using ServiceLayer.Interfaces.CommentService;
using ServiceLayer.Interfaces.IPostService;
using ServiceLayer.Services.UtilServices;

namespace Server.Controllers
{
    [Route("API/[controller]")]
    [EnableCors("AllowOrigin")]
    public class CommentController(ICommentService commentService, IPostService postService, IMapper mapper):Controller
    {
        private readonly ICommentService _commentService = commentService;
        private readonly IPostService _postService = postService;
        private readonly IMapper _mapper = mapper;

        [HttpPost("create")]
        [EnableCors("AllowOrigin")]
        public async Task<IActionResult> CreateComment([FromBody] CommentRequestDTO comment)
        {
            var response = new ResponseService<CommentResponseDTO>();
            var session = (Session?) HttpContext.Items["Session"];

            if(session == null)
            {
                response.msg= "Unauthorized";
                return StatusCode(401,response);
            }

            if(comment.comment.Equals(""))
            {
                response.msg = "Comment cannot be emptied";
                return BadRequest(response);
            }

            try
            {
                var existedPost = await _postService.FindPostById(comment.postId);
                if(existedPost==null)
                {
                    response.msg = "Post does not exist";
                    return BadRequest(response);
                }
                var createdComment = await _commentService.CreateComment(_mapper.Map<CommentRequestDTO,Comment>(comment));
                if(createdComment == null)
                {
                    response.msg = "Cannot create comment";
                    return BadRequest(response);
                }
                response.Response = _mapper.Map<Comment,CommentResponseDTO>(createdComment);
                response.msg = "Comment created successfully";
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
        public async Task<IActionResult> GetComments([FromQuery]string PostId,[FromQuery] int page=0, [FromQuery] int limit=10)
        {
            var response = new ResponseService<List<CommentResponseDTO>>();

            try
            {
                var foundComments = await _commentService.FindComments(new SearchCommentOption(){PostId=PostId,limit=limit,page=page});
                response.msg = "Found comments";
                response.Response = foundComments.Select(c=>_mapper.Map<Comment,CommentResponseDTO>(c)).ToList();
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