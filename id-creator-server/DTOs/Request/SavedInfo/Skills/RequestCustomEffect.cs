using Server.Interface.UtilInterfaces;

namespace Server.DTOs.Request.SavedInfo.Skills
{
    public class RequestCustomEffect:SkillRequestBase
    {
        public string Name { get; set; } = "";
        public string CustomImg { get; set; } = "";
        public string EffectColor { get; set; } = "#F1F1F1";
        public string Effect { get; set; } = "";
        public bool IsCoinType { get; set; } = false;
    }
}
