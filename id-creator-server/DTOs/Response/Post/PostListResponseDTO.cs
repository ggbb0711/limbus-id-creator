namespace Server.DTOs.Response.Post
{
    public class PostListResponseDTO
    {
        public List<PostResponseDTO> List { get; set; } = [];
        public int Total { get; set; } = 0;
    }
}