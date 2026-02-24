using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Server.Interface.UtilInterfaces;

namespace Server.Models
{
    [Index(nameof(Id))]
    [PrimaryKey(nameof(Id),nameof(SavedSkillId))]
    public class OffenseSkill : IImageAttach,ISkillIndex,ISkillType
    {
        private ImageObj _imageAttach;
        private ILazyLoader LazyLoader { get; set; }

        public OffenseSkill() { }

        private OffenseSkill(ILazyLoader lazyLoader)
        {
            LazyLoader = lazyLoader;
        }

        public Guid Id { get; set; }
        public int Index { get; set; }

        [ForeignKey(nameof(SavedSkill))]
        public Guid SavedSkillId { get; set; }

        public int SkillLevel { get; set; } = 0;
        public int SkillAmt { get; set; } = 1;
        public int AtkWeight { get; set; } = 1;
        public string DamageType { get; set; } = "Slash";
        public string Name { get; set; } = string.Empty;
        public string SkillAffinity { get; set; } = "Wrath";
        public int BasePower { get; set; } = 0;
        public int CoinNo { get; set; } = 1;
        public int CoinPow { get; set; } = 0;

        [Required]
        [ForeignKey(nameof(ImageObj))]
        public Guid ImageAttachId { get; set; }

        [Required]
        public virtual ImageObj ImageAttach
        {
            get => LazyLoader.Load(this, ref _imageAttach);
            set => _imageAttach = value;
        }

        public string SkillEffect { get; set; } = "";
        public string SkillLabel { get; set; } = "SKILL";
        public string SkillFrame { get; set; } = "1";
        public string Type { get; set; } = "OffenseSkill";
    }
}