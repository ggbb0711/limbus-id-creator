


using Microsoft.EntityFrameworkCore;

namespace Server.Models
{
    [PrimaryKey(nameof(Id))]
    public class SavedSkill
    {
        public Guid Id { get; set; }
        public virtual ICollection<OffenseSkill>? OffenseSkills { get; set; } = [];
        public virtual ICollection<DefenseSkill>? DefenseSkills { get; set; } = [];
        public virtual ICollection<PassiveSkill>? PassiveSkills { get; set; } = [];
        public virtual ICollection<MentalEffect>? MentalEffects { get; set; } = [];
        public virtual ICollection<CustomEffect>? CustomEffects { get; set; } = [];
    }
}