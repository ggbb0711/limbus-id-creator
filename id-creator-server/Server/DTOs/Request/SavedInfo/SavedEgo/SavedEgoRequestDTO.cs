

namespace Server.DTOs.Requests.SavedInfo.SavedEgo
{
    public class SavedEgoRequestDTO
    {
        public string Title { get; set; }
        public string Name { get; set; }
        public int SanityCost { get; set; }
        public string SplashArt { get; set; }
        public double SplashArtScale { get; set; }
        public SplashArtTranslationObj SplashArtTranslation { get; set; }
        public SinResistantObj SinResistant { get; set; }
        public SinCostObj SinCost { get; set; }
        public string SinnerColor { get; set; }
        public string SinnerIcon { get; set; }
        public string EgoLevel { get; set; }
        public List<object> SkillDetails { get; set; }

        public class SplashArtTranslationObj
        {
            public double X { get; set; }
            public double Y { get; set; }
        }
        public class SinResistantObj
        {
            public int WrathResistant { get; set; }
            public int LustResistant { get; set; }
            public int SlothResistant { get; set; }
            public int GluttonyResistant { get; set; }
            public int GloomResistant { get; set; }
            public int PrideResistant { get; set; }
            public int EnvyResistant { get; set; }
        }

        public class SinCostObj
        {
            public int WrathCost { get; set; }
            public int LustCost { get; set; }
            public int SlothCost { get; set; }
            public int GluttonyCost { get; set; }
            public int GloomCost { get; set; }
            public int PrideCost { get; set; }
            public int EnvyCost { get; set; }
        }
    }



}