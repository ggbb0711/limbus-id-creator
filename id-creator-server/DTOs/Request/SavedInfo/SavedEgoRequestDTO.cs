

using FluentValidation;
using Server.DTOs.Request.SavedInfo.Skills;
using Server.Util;

namespace Server.DTOs.Requests.SavedInfo.SavedEgo
{
    public class SavedEgoRequestDTO
    {
        public string Title { get; set; } ="";
        public string Name { get; set; } = "";
        public double SanityCost { get; set; }
        public string SplashArt { get; set; } = "";
        public double SplashArtScale { get; set; }
        public required SplashArtTranslationObj SplashArtTranslation { get; set; }
        public required SinResistantObj SinResistant { get; set; }
        public required SinCostObj SinCost { get; set; }
        public string SinnerColor { get; set; } = "";
        public string SinnerIcon { get; set; } = "";
        public string EgoLevel { get; set; } = "";
        public required List<SkillRequestBase> SkillDetails { get; set; }

        public class SinResistantObj
        {
            public double Wrath { get; set; }
            public double Lust { get; set; }
            public double Sloth { get; set; }
            public double Gluttony { get; set; }
            public double Gloom { get; set; }
            public double Pride { get; set; }
            public double Envy { get; set; }
        }

        public class SinCostObj
        {
            public double Wrath { get; set; }
            public double Lust { get; set; }
            public double Sloth { get; set; }
            public double Gluttony { get; set; }
            public double Gloom { get; set; }
            public double Pride { get; set; }
            public double Envy { get; set; }
        }
    }
    public class SavedEgoRequestDTODTOValidator : AbstractValidator<SavedEgoRequestDTO>
    {
        public SavedEgoRequestDTODTOValidator()
        {
            RuleFor(s=>s.SplashArt)
                .MustAsync(async (image,_)=>await FileHelper.CheckUrlSize(image, 4 * 1024 * 1024))
                .WithMessage("Splash art url size must be <= 4mb");
            
            RuleFor(s=>s.SinnerIcon)
                .MustAsync(async (image,_)=>await FileHelper.CheckUrlSize(image, 100 * 1024))
                .WithMessage("Sinner icon url size <= 100kb");

            RuleForEach(s => s.SkillDetails).SetInheritanceValidator(v =>
            {
                v.Add(new RequestOffenseSkillValidator());
                v.Add(new RequestDefenseSkillValidator());
                v.Add(new RequestCustomEffectValidator());
            });
        }
    }
}