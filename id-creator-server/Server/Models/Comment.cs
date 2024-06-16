


using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Server.Models
{
    [PrimaryKey(nameof(SaveInfoId))]
    public class Comment
    {
        public Guid Id { get; set; }
        public string Content { get; set; } ="";
        [ForeignKey(nameof(SavedInfo))]
        public Guid SaveInfoId { get; set; }
        [ForeignKey(nameof(User))]
        public Guid UserId { get; set; }
    }
}