


using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Server.Models
{
    [Index(nameof(Id))]
    [PrimaryKey(nameof(Id))]
    public class MentalEffect
    {
        public Guid Id { get; set; }
        public int Index { get; set; }
        [ForeignKey(nameof(SavedSkill))]
        public Guid SavedSkillId { get; set; }
        public string Effect { get; set; } = string.Empty;
        public string Type { get; set; } = "MentalEffect";
    }
}