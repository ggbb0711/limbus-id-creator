using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using RepositoryLayer.Utils.UtilInterfaces;

namespace RepositoryLayer.Models
{
    [Index(nameof(Id))]
    [PrimaryKey(nameof(Id),nameof(SavedSkillId))]
    public class MentalEffect : ISkillIndex,ISkillType
    {
        private ILazyLoader LazyLoader { get; set; }

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
        public string Type { get; set; } = "MentalEffect";

    }
}