namespace ServiceLayer.DTOs.Response.Post
{
    public class PostListResponseDTO
    {
        public List<PostResponseDTO> list { get; set; } = [];
        public int total { get; set; } = 0;
    }
}