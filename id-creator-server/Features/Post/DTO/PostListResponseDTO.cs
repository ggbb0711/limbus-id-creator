using Server.Features.Post.DTO;

namespace Server.Features.Post.DTO
{
    public class PostListResponseDTO
    {
        public List<PostResponseDTO> List { get; set; } = [];
        public int Total { get; set; } = 0;
    }
}