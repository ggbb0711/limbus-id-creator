


using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Server.Interface.UtilInterfaces;

namespace Server.Models
{
    [Index(nameof(Id))]
    [PrimaryKey(nameof(Id),nameof(SavedSkillId))]
    public class PassiveSkill : ISkillIndex,ISkillType
    {
        private ILazyLoader LazyLoader { get; set; }

        public PassiveSkill() { }

        private PassiveSkill(ILazyLoader lazyLoader)
        {
            LazyLoader = lazyLoader;
        }

        public Guid Id { get; set; }
        public int Index { get; set; }

        [ForeignKey(nameof(SavedSkill))]
        public Guid SavedSkillId { get; set; }

        public string SkillLabel { get; set; } = "PASSIVE";
        public string Name { get; set; } = "";
        public string SkillEffect { get; set; } = "";
        public string Type { get; set; } = "PassiveSkill";
        public string Affinity { get; set; } = "Wrath";
        public string Req { get; set; } = "Own"; // Res or own or none
        public int ReqNo { get; set; } = 1;
    }
}