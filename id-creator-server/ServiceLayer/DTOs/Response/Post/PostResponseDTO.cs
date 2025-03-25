
namespace ServiceLayer.DTOs.Response.Post
{
    public class PostResponseDTO
    {
        public Guid id { get; set; }
        public string title { get; set; } = "";
        public string description { get; set; } = "";
        public List<string> imagesAttach { get; set; } = [];
        public string userIcon { get; set; }
        public string userName { get; set; }
        public Guid userId { get; set; }
        public string created { get; set; }
        public List<string> tags { get; set; } = [];
        public int viewCount { get; set; } = 0;
        public int commentCount { get; set; } = 0;
    }
}