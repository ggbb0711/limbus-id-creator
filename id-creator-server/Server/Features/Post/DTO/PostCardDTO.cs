using System.Text.Json;
using Server.Shared.Model;

namespace Server.Features.Post.DTO
{
    public class PostCardRequestDTO
    {
        public Guid SaveId { get; set; }
        public PostCardKind Kind { get; set; }
    }

    public class PostCardResponseDTO
    {
        public Guid Id { get; set; }
        public int Position { get; set; }
        public PostCardKind Kind { get; set; }
        public string ImageUrl { get; set; } = "";
        public Guid? SaveId { get; set; }
        public JsonElement SaveInfo { get; set; }
    }
}
