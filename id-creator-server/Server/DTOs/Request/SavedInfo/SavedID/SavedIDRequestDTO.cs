namespace Server.DTOs.Requests.SavedInfo.SavedID
{
    public class SavedIDRequestDTO
    {
        public string Title { get; set; }
        public string Name { get; set; }
        public string SplashArt { get; set; }
        public double SplashArtScale { get; set; }
        public SplashArtTranslationObj SplashArtTranslation { get; set; }
        public int HP { get; set; }
        public int MinSpeed { get; set; }
        public int MaxSpeed { get; set; }
        public string StaggerResist { get; set; }
        public int DefenseLevel { get; set; }
        public string SinnerColor { get; set; }
        public string SinnerIcon { get; set; }
        public int SlashResistant { get; set; }
        public int PierceResistant { get; set; }
        public int BluntResistant { get; set; }
        public string Rarity { get; set; }
        public List<object> SkillDetails { get; set; } 

        public class SplashArtTranslationObj
        {
            public double X { get; set; }
            public double Y { get; set; }
        }
    }

}