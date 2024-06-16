


using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Server.Models
{
    [Index(nameof(Id))]
    [PrimaryKey(nameof(Id))]
    public class PassiveSkill
    {
        public Guid Id { get; set; }
        public int Index { get; set; }
        [ForeignKey(nameof(SavedSkill))]
        public Guid SaveSkillId { get; set; }
        public string SkillLabel { get; set; } = "PASSIVE";
        public string Name { get; set; } = string.Empty;
        public string SkillEffect { get; set; } = string.Empty;
        public string Type { get; set; } = "PassiveSkill";
        public string Affinity { get; set; } = "Wrath";
        public string Req { get; set; } = "Own"; // Res or own or none
        public int ReqNo { get; set; } = 1;
    }
}