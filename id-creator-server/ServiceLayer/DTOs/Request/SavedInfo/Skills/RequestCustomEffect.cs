
using RepositoryLayer.Utils.UtilInterfaces;

namespace ServiceLayer.DTOs.Request.SavedInfo.Skills
{
    public class RequestCustomEffect:IRequestSkillType
    {
        public Guid inputId { get; set; } 
        public string name { get; set; } = "";
        public string customImg { get; set; } = "";
        public string effectColor { get; set; } = "#F1F1F1";
        public string effect { get; set; } = "";
        public string type { get; set; } = "CustomEffect";
    }
}