using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Server.Interface.UtilInterfaces;
using Server.Util.Enums;

namespace Server.Models
{
    [Index(nameof(Id))]
    [PrimaryKey(nameof(Id),nameof(SavedSkillId))]
    public class CustomEffect : ISkill,IImageAttach,ISkillIndex,ISkillType
    {
        private ImageObj? _imageAttach;
        private ILazyLoader LazyLoader { get; set; } = null!;

        public CustomEffect() { }

        private CustomEffect(ILazyLoader lazyLoader)
        {
            LazyLoader = lazyLoader;
        }

        public Guid Id { get; set; }
        public int Index { get; set; }

        [ForeignKey(nameof(SavedSkill))]
        public Guid SavedSkillId { get; set; }

        public string Name { get; set; } = "";

        [ForeignKey(nameof(ImageObj))]
        public Guid ImageAttachId { get; set; }

        [Required]
        public virtual ImageObj ImageAttach
        {
            get => LazyLoader.Load(this, ref _imageAttach)!;
            set => _imageAttach = value;
        }

        public string EffectColor { get; set; } = "#F1F1F1";
        public string Effect { get; set; } = "";
        public bool IsCoinType { get; set; } = false;
        public SkillType Type { get; set; } = SkillType.CustomEffect;
    }
}
