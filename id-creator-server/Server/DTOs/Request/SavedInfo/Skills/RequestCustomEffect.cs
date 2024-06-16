
namespace Server.DTOs.Requests.SavedInfo.Skills
{
    public class RequestCustomEffect
    {
        public string InputId { get; set; } = Guid.NewGuid().ToString();
        public string Name { get; set; } = "";
        public string CustomImg { get; set; } = "";
        public string EffectColor { get; set; } = "#F1F1F1";
        public string Effect { get; set; } = "";
        public string Type { get; set; } = "CustomEffect";
    }
}