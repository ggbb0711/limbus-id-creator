
namespace ServiceLayer.DTOs.Request.Post
{
    public class PostRequestDTO
    {
        public Guid id { get; set; }
        public string title { get; set; } = "";
        public string description { get; set; } = "";
        public List<string> imagesAttach { get; set; } = [];
        public Guid userId { get; set; }
        public List<string> tags { get; set; } = [];
    }
}