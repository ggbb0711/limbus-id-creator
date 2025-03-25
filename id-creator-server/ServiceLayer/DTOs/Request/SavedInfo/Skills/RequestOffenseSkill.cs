using RepositoryLayer.Utils.UtilInterfaces;

namespace ServiceLayer.DTOs.Request.SavedInfo.Skills
{
    public class RequestOffenseSkill:IRequestSkillType
    {
        public int skillLevel { get; set; } = 0;
        public int skillAmt { get; set; } = 1;
        public int atkWeight { get; set; } = 1;
        public Guid inputId { get; set; }
        public string damageType { get; set; } = "Slash";
        public string name { get; set; } = "";
        public string skillAffinity { get; set; } = "Wrath";
        public int basePower { get; set; } = 0;
        public int coinNo { get; set; } = 1;
        public int coinPow { get; set; } = 0;
        public string skillImage { get; set; } = "";
        public string skillEffect { get; set; } = "";
        public string skillLabel { get; set; } = "SKILL";
        public string type { get; set; } = "OffenseSkill";

    }
}
