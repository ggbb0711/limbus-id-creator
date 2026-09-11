using FluentValidation;
using Server.Features.Images;
using Server.Features.SaveInfo.DTO.Skills;

namespace Server.Features.SaveInfo.DTO
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

    public class SavedIDRequestDTOValidator : AbstractValidator<SavedIDRequestDTO>
    {
        public SavedIDRequestDTOValidator()
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