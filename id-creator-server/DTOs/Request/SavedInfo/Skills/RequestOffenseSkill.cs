using Server.Interface.UtilInterfaces;

namespace Server.DTOs.Request.SavedInfo.Skills
{
    public class RequestOffenseSkill:ActiveSkillRequestBase
    {
        public int skillLevel { get; set; } = 0;
        public int skillAmt { get; set; } = 1;
        public int atkWeight { get; set; } = 1;
        public string damageType { get; set; } = "Slash";

    }
}
