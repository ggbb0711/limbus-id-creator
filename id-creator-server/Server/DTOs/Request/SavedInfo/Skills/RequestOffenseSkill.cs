namespace Server.DTOs.Requests.SavedInfo.Skills
{
    public class RequestOffenseSkill
    {
        public int SkillLevel { get; set; } = 0;
        public int SkillAmt { get; set; } = 1;
        public int AtkWeight { get; set; } = 1;
        public Guid InputId { get; set; }
        public string DamageType { get; set; } = "Slash";
        public string Name { get; set; } = "";
        public string SkillAffinity { get; set; } = "Wrath";
        public int BasePower { get; set; } = 0;
        public int CoinNo { get; set; } = 1;
        public int CoinPow { get; set; } = 0;
        public string SkillImage { get; set; } = "";
        public string SkillEffect { get; set; } = "";
        public string SkillLabel { get; set; } = "SKILL";
        public string Type { get; set; } = "OffenseSkill";
    }
}
