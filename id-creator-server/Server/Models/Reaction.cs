


using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Server.Models
{
    [Index(nameof(UserId),nameof(SaveInfoId))]
    [PrimaryKey(nameof(Id))]
    public class Reaction
    {
        public Guid Id { get; set; }
        public int Value { get; set; }
        [ForeignKey(nameof(User))]
        public Guid UserId  { get; set; }
        [ForeignKey(nameof(SavedInfo))]
        public Guid SaveInfoId { get; set; }
    }
}