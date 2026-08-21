

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Server.DTOs.Requests.Comment;
using Server.Interface.ServiceInterface.CommentService;
using Server.Interface.UtilInterfaces;
using Server.Models;
using Server.Obj;
using Server.Response.Comment;
using Server.Util.ApiException;

namespace Server.Controllers
{
    [Route("API/[controller]")]
    [EnableCors("AllowOrigin")]
    public class CommentController(ICommentService commentService, IMapper mapper):Controller
    {

        [HttpPost("")]
        [EnableCors("AllowOrigin")]
        [Authorize]
        public async Task<ActionResult<CommentResponseDTO>> CreateComment([FromBody] CommentRequestDTO commentRequestDTO)
        {
            //TODO: Add custom validators to make sure that comment is required
            var sub = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (!Guid.TryParse(sub, out var userId))
                throw new UnauthorizedException("Invalid access token");
            var comment = mapper.Map<Comment>(commentRequestDTO);
            comment.UserId = userId;
            var createdComment = await commentService.CreateComment(comment);
            return Ok(ApiResponse<CommentResponseDTO>.Ok(mapper.Map<CommentResponseDTO>(createdComment), "Comment created successfully."));
        }

        [HttpGet("post/{postId}")]
        public async Task<ActionResult<List<CommentResponseDTO>>> GetComments(Guid postId,[FromQuery] int page=0, [FromQuery] int limit=10)
        {
            var comments = await commentService.FindComments(new SearchCommentOption()
            {
                PostId = postId,
                Limit = limit,
                Page = page,
            });
            return Ok(ApiResponse<List<CommentResponseDTO>>.Ok([.. comments.Select(c=>mapper.Map<CommentResponseDTO>(c))]));
        }
    }
}