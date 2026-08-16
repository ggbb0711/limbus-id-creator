using Server.Interface.UtilInterfaces;

namespace Server.DTOs.Request.SavedInfo.Skills
{
    public class RequestCustomEffect:SkillRequestBase
    {
        public string name { get; set; } = "";
        public string customImg { get; set; } = "";
        public string effectColor { get; set; } = "#F1F1F1";
        public string effect { get; set; } = "";
        public bool isCoinType { get; set; } = false;
    }
}
