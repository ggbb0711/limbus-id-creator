namespace Server.Response.Comment
{
    public class CommentResponseDTO
    {
        public string UserIcon { get; set; } = "";
        public string UserName { get; set; } = "";
        public Guid UserId { get; set; }
        public Guid PostId { get; set; }
        public string Content { get; set; } = "";
        public string Date { get; set; } = "";
    }
}