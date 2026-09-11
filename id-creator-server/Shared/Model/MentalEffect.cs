



using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Server.Features.SaveInfo.Enum;
using Server.Shared.Model.Interface;

namespace Server.Shared.Model
{
    [Index(nameof(Id))]
    [PrimaryKey(nameof(Id),nameof(SavedSkillId))]
    public class MentalEffect : ISkill,ISkillIndex,ISkillType
    {
        private ILazyLoader LazyLoader { get; set; } = null!;

        public MentalEffect() { }

        private MentalEffect(ILazyLoader lazyLoader)
        {
            LazyLoader = lazyLoader;
        }

        public Guid Id { get; set; }
        public int Index { get; set; }

        [ForeignKey(nameof(SavedSkill))]
        public Guid SavedSkillId { get; set; }

        public string Effect { get; set; } = "";
        public SkillType Type { get; set; } = SkillType.MentalEffect;

    }
}
