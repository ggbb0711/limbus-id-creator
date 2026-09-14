

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Server.Features.Comment.DTO;
using Server.Features.Comment.Repository;
using Server.Features.Comment.Service;
using Server.Shared.Exception;
using Server.Shared.Filter;
using Server.Shared.Http;

namespace Server.Features.Comment
{
    [Route("API/[controller]")]
    [EnableCors("AllowOrigin")]
    public class CommentController(ICommentService commentService, IMapper mapper):Controller
    {

        [HttpPost("")]
        [EnableCors("AllowOrigin")]
        [Authorize]
        [ValidationFilter<CommentRequestDTO>]
        public async Task<ActionResult<CommentResponseDTO>> CreateComment([FromBody] CommentRequestDTO commentRequestDTO)
        {
            var sub = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (!Guid.TryParse(sub, out var userId))
                throw new UnauthorizedException("Invalid access token");
            var comment = mapper.Map<CommentModel>(commentRequestDTO);
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