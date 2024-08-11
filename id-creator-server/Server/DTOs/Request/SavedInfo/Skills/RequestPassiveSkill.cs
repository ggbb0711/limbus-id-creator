using Server.Interface.UtilInterfaces;

namespace Server.DTOs.Requests.SavedInfo
{
    public class RequestPassiveSkill:IRequestSkillType
    {
        public string skillLabel { get; set; } = "PASSIVE";
        public Guid inputId { get; set; } 
        public string name { get; set; } = "";
        public string skillEffect { get; set; } = "";
        public string type { get; set; } = "PassiveSkill";
        public string affinity { get; set; } = "Wrath";
        public string req { get; set; } = "Own"; // Res or own or none
        public int reqNo { get; set; } = 1;
    }
}