using Server.Interface.UtilInterfaces;

namespace Server.DTOs.Requests.SavedInfo.Skills
{
    public class RequestMentalEffect:IRequestSkillType
    {
        public Guid inputId { get; set; } 
        public string effect { get; set; }="";
        public string type { get; set; } = "MentalEffect";
    }
}