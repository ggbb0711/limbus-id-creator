namespace Server.DTOs.Request.SavedInfo.Skills
{
    public class RequestDefenseSkill:ActiveSkillRequestBase
    {
        public int SkillLevel { get; set; } = 0;
        public int SkillAmt { get; set; } = 1;
        public int AtkWeight { get; set; } = 1;
        public string DefenseType { get; set; } = "Block";
        public string DamageType { get; set; } = "Slash"; // For counter skill
    }
}
