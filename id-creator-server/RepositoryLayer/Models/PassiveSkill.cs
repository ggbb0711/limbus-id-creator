using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using RepositoryLayer.Utils.UtilInterfaces;

namespace RepositoryLayer.Models
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