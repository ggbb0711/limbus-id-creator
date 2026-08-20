
namespace Server.DTOs.Requests.Post
{
    public class PostRequestDTO
    {
        public string Title { get; set; } = "";
        public string Description { get; set; } = "";
        public List<string> ImagesAttach { get; set; } = [];
        public List<string> Tags { get; set; } = [];
    }
}