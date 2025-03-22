

namespace ServiceLayer.DTOs.Request.SavedInfo.SavedEgo
{
    public class SavedEgoRequestDTO
    {
        public string title { get; set; }
        public string name { get; set; }
        public double sanityCost { get; set; }
        public string splashArt { get; set; }
        public double splashArtScale { get; set; }
        public SplashArtTranslationObj splashArtTranslation { get; set; }
        public SinResistantObj sinResistant { get; set; }
        public SinCostObj sinCost { get; set; }
        public string sinnerColor { get; set; }
        public string sinnerIcon { get; set; }
        public string egoLevel { get; set; }
        public List<object> skillDetails { get; set; }

        public class SinResistantObj
        {
            public double wrath_resistant { get; set; }
            public double lust_resistant { get; set; }
            public double sloth_resistant { get; set; }
            public double gluttony_resistant { get; set; }
            public double gloom_resistant { get; set; }
            public double pride_resistant { get; set; }
            public double envy_resistant { get; set; }
        }

        public class SinCostObj
        {
            public double wrath_cost { get; set; }
            public double lust_cost { get; set; }
            public double sloth_cost { get; set; }
            public double gluttony_cost { get; set; }
            public double gloom_cost { get; set; }
            public double pride_cost { get; set; }
            public double envy_cost { get; set; }
        }
    }
}