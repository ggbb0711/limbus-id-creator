using Server.Interface.UtilInterfaces;

namespace Server.DTOs.Request.SavedInfo.Skills
{
    public class RequestDefenseSkill:ActiveSkillRequestBase
    {
        public int skillLevel { get; set; } = 0;
        public int skillAmt { get; set; } = 1;
        public int atkWeight { get; set; } = 1;
        public string defenseType { get; set; } = "Block";
        public string damageType { get; set; } = "Slash"; // For counter skill
    }
}
