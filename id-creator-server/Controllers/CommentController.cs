

using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Server.DTOs.Requests.Comment;
using Server.Interface.ServiceInterface.CommentService;
using Server.Interface.ServiceInterface.IPostService;
using Server.Interface.UtilInterfaces;
using Server.Models;
using Server.Obj;
using Server.Response.Comment;

namespace Server.Controllers
{
    [Route("API/[controller]")]
    [EnableCors("AllowOrigin")]
    public class CommentController(ICommentService commentService, IPostService postService, IMapper mapper):Controller
    {

        [HttpPost("create")]
        [EnableCors("AllowOrigin")]
        [Authorize]
        public async Task<ActionResult<CommentResponseDTO>> CreateComment([FromBody] CommentRequestDTO commentRequestDTO)
        {
            //TODO: Add custom validators to make sure that comment is required
            var createdComment = await commentService.CreateComment(mapper.Map<Comment>(commentRequestDTO));
            return Ok(ApiResponse<CommentResponseDTO>.Ok(mapper.Map<CommentResponseDTO>(createdComment), "Comment created successfully."));
        }

        [HttpGet("")]
        public async Task<ActionResult<List<CommentResponseDTO>>> GetComments([FromQuery]Guid PostId,[FromQuery] int page=0, [FromQuery] int limit=10)
        {
            var comments = await commentService.FindComments(new SearchCommentOption()
            {
                PostId = PostId,
                limit = limit,
                page = page,
            });
            return Ok(ApiResponse<List<CommentResponseDTO>>.Ok(comments.Select(c=>mapper.Map<CommentResponseDTO>(c)).ToList()));
        }
    }
}