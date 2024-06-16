namespace Server.DTOs.Requests.SavedInfo
{
    public class RequestPassiveSkill
    {
        public string SkillLabel { get; set; } = "PASSIVE";
        public Guid InputId { get; set; } 
        public string Name { get; set; } = "";
        public string SkillEffect { get; set; } = "";
        public string Type { get; set; } = "PassiveSkill";
        public string Affinity { get; set; } = "Wrath";
        public string Req { get; set; } = "Own"; // Res or own or none
        public int ReqNo { get; set; } = 1;
    }
}