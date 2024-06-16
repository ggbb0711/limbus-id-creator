


using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Server.Models
{
    [Index(nameof(Id))]
    [PrimaryKey(nameof(Id))]
    public class SavedInfo
    {
        public Guid Id { get; set; }
        public string Name { get; set; } ="";
        public DateTime SaveTime { get; set; }
        [ForeignKey(nameof(ImageObj))]
        public Guid ImageAttachKey { get; set; }
        public ImageObj? ImageAttach { get; set; }
        public bool IsPublic { get; set; } = false;
        public virtual ICollection<Comment>? Comments { get; set; } = [];
        public virtual ICollection<Reaction>? Reactions { get; set; } = [];
        public virtual ICollection<Tag> Tags { get; set; } = [];
        [ForeignKey(nameof(User))]
        public Guid UserId { get; set; }
        [Required]
        public virtual User User { get; set; }
        [ForeignKey(nameof(SavedId))]
        public Guid SavedIdKey { get; set;}
        public virtual SavedId? SavedId { get; set; }
        [ForeignKey(nameof(SavedEgo))]
        public Guid SavedEgoKey { get; set; }
        public virtual SavedEgo? SavedEgo { get; set; }
    }
}