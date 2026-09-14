



using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Server.Features.SaveInfo.Enum;
using Server.Shared.Model.Interface;

namespace Server.Shared.Model
{
    [Index(nameof(Id))]
    [PrimaryKey(nameof(Id),nameof(SavedSkillId))]
    public class PassiveSkill : ISkill,ISkillIndex,ISkillType
    {
        private ILazyLoader LazyLoader { get; set; } = null!;

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
        public SkillType Type { get; set; } = SkillType.PassiveSkill;
        public string Affinity { get; set; } = "Wrath";
        public string Req { get; set; } = "Own"; // Res or own or none
        public int ReqNo { get; set; } = 1;
        public int ReqOwnWrath { get; set; } = 0;
        public int ReqOwnLust { get; set; } = 0;
        public int ReqOwnPride { get; set; } = 0;
        public int ReqOwnSloth { get; set; } = 0;
        public int ReqOwnGluttony { get; set; } = 0;
        public int ReqOwnEnvy { get; set; } = 0;
        public int ReqOwnGloom { get; set; } = 0;
        public int ReqResWrath { get; set; } = 0;
        public int ReqResLust { get; set; } = 0;
        public int ReqResPride { get; set; } = 0;
        public int ReqResSloth { get; set; } = 0;
        public int ReqResGluttony { get; set; } = 0;
        public int ReqResEnvy { get; set; } = 0;
        public int ReqResGloom { get; set; } = 0;

    }
}
