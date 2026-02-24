namespace Server.DTOs.Requests.SavedInfo.SavedID
{
    public class SavedIDRequestDTO
    {
        public string title { get; set; }
        public string name { get; set; }
        public string splashArt { get; set; }
        public double splashArtScale { get; set; }
        public SplashArtTranslationObj splashArtTranslation { get; set; }
        public double hp { get; set; }
        public double minSpeed { get; set; }
        public double maxSpeed { get; set; }
        public string staggerResist { get; set; }
        public double defenseLevel { get; set; }
        public string sinnerColor { get; set; }
        public string sinnerIcon { get; set; }
        public double slashResistant { get; set; }
        public double pierceResistant { get; set; }
        public double bluntResistant { get; set; }
        public string rarity { get; set; }
        public List<string> traits { get; set; } = [];
        public List<object> skillDetails { get; set; }

        
    }

}