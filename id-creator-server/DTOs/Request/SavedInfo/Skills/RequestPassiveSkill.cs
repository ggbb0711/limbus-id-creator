using Server.Interface.UtilInterfaces;

namespace Server.DTOs.Request.SavedInfo.Skills
{
    public class RequestPassiveSkill:SkillRequestBase
    {
        public string SkillLabel { get; set; } = "PASSIVE";
        public string Name { get; set; } = "";
        public string SkillEffect { get; set; } = "";
        public string Affinity { get; set; } = "Wrath";
        public string Req { get; set; } = "Own"; // Res or own or none
        public int ReqNo { get; set; } = 1;
        public PassiveSinCost ReqOwn { get; set; } = new PassiveSinCost();
        public PassiveSinCost ReqRes { get; set; } = new PassiveSinCost();
    }

    public class PassiveSinCost{
        public int Wrath { get; set; } = 0;
        public int Lust { get; set; } = 0;
        public int Sloth { get; set; } = 0;
        public int Gluttony { get; set; } = 0;
        public int Gloom { get; set; } = 0;
        public int Pride { get; set; } = 0;
        public int Envy { get; set; } = 0;
    }
}