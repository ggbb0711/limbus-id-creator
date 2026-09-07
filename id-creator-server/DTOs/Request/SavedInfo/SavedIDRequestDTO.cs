using Server.DTOs.Request.SavedInfo.Skills;

namespace Server.DTOs.Requests.SavedInfo.SavedID
{
    public class SavedIDRequestDTO
    {
        public string Title { get; set; } = "";
        public string Name { get; set; } = "";
        public string SplashArt { get; set; } = "";
        public double SplashArtScale { get; set; }
        public required SplashArtTranslationObj SplashArtTranslation { get; set; }
        public double HP { get; set; }
        public double MinSpeed { get; set; }
        public double MaxSpeed { get; set; }
        public string StaggerResist { get; set; } = "";
        public double DefenseLevel { get; set; }
        public string SinnerColor { get; set; } = "";
        public string SinnerIcon { get; set; } = "";
        public double SlashResistant { get; set; }
        public double PierceResistant { get; set; }
        public double BluntResistant { get; set; }
        public string Rarity { get; set; } = "";
        public List<string> Traits { get; set; } = [];
        public required List<SkillRequestBase> SkillDetails { get; set; }

        
    }

}