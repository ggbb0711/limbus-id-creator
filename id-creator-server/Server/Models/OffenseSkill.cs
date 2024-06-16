


using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Server.Interface;
using Server.Interface.UtilInterfaces;

namespace Server.Models
{
    [Index(nameof(Id))]
    [PrimaryKey(nameof(Id))]
    public class OffenseSkill : IImageAttach
    {
        public Guid Id { get; set; }
        public int Index { get; set; }
        [ForeignKey(nameof(SavedSkill))]
        public Guid SaveSkillId { get; set; }
        public int SkillLevel { get; set; } = 0;
        public int SkillAmt { get; set; } = 1;
        public int AtkWeight { get; set; } = 1;
        public string DamageType { get; set; } = "Slash";
        public string Name { get; set; } = string.Empty;
        public string SkillAffinity { get; set; } = "Wrath";
        public int BasePower { get; set; } = 0;
        public int CoinNo { get; set; } = 1;
        public int CoinPow { get; set; } = 0;
        [ForeignKey(nameof(ImageObj))]
        public Guid ImageAttachKey { get; set; }
        public ImageObj? ImageAttach { get; set; }
        public string SkillEffect { get; set; } = string.Empty;
        public string SkillLabel { get; set; } = "SKILL";
        public string Type { get; set; } = "OffenseSkill";
    }
}