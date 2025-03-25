using RepositoryLayer.Utils.UtilInterfaces;

namespace ServiceLayer.DTOs.Request.SavedInfo.Skills
{
    public class RequestMentalEffect:IRequestSkillType
    {
        public Guid inputId { get; set; } 
        public string effect { get; set; }="";
        public string type { get; set; } = "MentalEffect";
    }
}