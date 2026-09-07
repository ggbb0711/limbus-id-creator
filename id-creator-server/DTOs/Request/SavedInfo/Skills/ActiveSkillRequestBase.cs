namespace Server.DTOs.Request.SavedInfo.Skills
{
    public abstract class ActiveSkillRequestBase: SkillRequestBase
    {
        public string Name { get; set; } = "";
        public string SkillAffinity { get; set; } = "Wrath";
        public int BasePower { get; set; } = 0;
        public int CoinNo { get; set; } = 1;
        public int CoinPow { get; set; } = 0;
        public string SkillImage { get; set; } = "";
        public string SkillEffect { get; set; } = "";
        public string SkillLabel { get; set; } = "SKILL";
        public string SkillFrame { get; set; } = "1";
    }
}