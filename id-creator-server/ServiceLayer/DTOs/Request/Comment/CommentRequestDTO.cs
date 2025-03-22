namespace ServiceLayer.DTOs.Request.Comment
{
    public class CommentRequestDTO
    {
        public Guid userId { get; set; }
        public Guid postId { get; set; }
        public string comment { get; set; }
        public string date { get; set; } = DateTime.Now.ToString("");
    }
}