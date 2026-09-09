using System.ComponentModel.DataAnnotations;

namespace Server.DTOs.Requests.Comment
{
    public class CommentRequestDTO
    {
        private Guid PostId { get; init; } = Guid.NewGuid();
        [Required(ErrorMessage = "Comment cannot be left emptied")]
        private string Content { get; init; } = "";
    }
}