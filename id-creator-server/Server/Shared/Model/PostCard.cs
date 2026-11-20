using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Server.Shared.Model
{
    public enum PostCardKind
    {
        Identity, Ego
    }

    [PrimaryKey(nameof(Id))]
    [Index(nameof(SaveId))]
    public class PostCard
    {
        public Guid Id { get; set; }

        [ForeignKey(nameof(Post))]
        public Guid PostId { get; set; }
        public Post? Post { get; set; }

        public int Position { get; set; }
        public PostCardKind Kind { get; set; }
        public Guid? SaveId { get; set; }
        public string ImageUrl { get; set; } = "";

        [Column(TypeName = "jsonb")]
        public string SaveInfo { get; set; } = "{}";
    }
}
