using System.ComponentModel.DataAnnotations;

namespace Server.DTOs.Requests.Comment
{
    public class CommentRequestDTO
    {
        private Guid UserId { get; init; }
        private Guid PostId { get; init; }
        [Required(ErrorMessage = "Comment cannot be left emptied")]
        private string Content { get; init; } = "";
        private string Date { get; init; } = DateTime.Now.ToString("");
    }
}