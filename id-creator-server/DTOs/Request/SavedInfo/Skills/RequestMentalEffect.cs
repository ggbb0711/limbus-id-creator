using Server.Interface.UtilInterfaces;

namespace Server.DTOs.Request.SavedInfo.Skills
{
    public class RequestMentalEffect:SkillRequestBase
    {
        public string effect { get; set; }="";
    }
}