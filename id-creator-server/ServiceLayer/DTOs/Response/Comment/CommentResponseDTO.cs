namespace ServiceLayer.DTOs.Response.Comment
{
    public class CommentResponseDTO
    {
        public string userIcon { get; set; }
        public string userName { get; set; }
        public Guid userId { get; set; }
        public Guid postId { get; set; }
        public string comment { get; set; }
        public string date { get; set; }
    }
}