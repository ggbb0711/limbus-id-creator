
namespace Server.DTOs.Response.Post
{
    public class PostResponseDTO
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = "";
        public string Description { get; set; } = "";
        public List<string> ImagesAttach { get; set; } = [];
        public string UserIcon { get; set; } = "";
        public string UserName { get; set; } = "";
        public Guid UserId { get; set; }
        public string Created { get; set; } = "";
        public List<string> Tags { get; set; } = [];
        public int ViewCount { get; set; } = 0;
        public int CommentCount { get; set; } = 0;
    }
}