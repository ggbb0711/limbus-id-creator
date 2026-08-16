namespace Server.DTOs.Request.SavedInfo.Skills
{
    public abstract class ActiveSkillRequestBase: SkillRequestBase
    {
        public string name { get; set; } = "";
        public string skillAffinity { get; set; } = "Wrath";
        public int basePower { get; set; } = 0;
        public int coinNo { get; set; } = 1;
        public int coinPow { get; set; } = 0;
        public string skillImage { get; set; } = "";
        public string skillEffect { get; set; } = "";
        public string skillLabel { get; set; } = "SKILL";
        public string skillFrame { get; set; } = "1";
    }
}