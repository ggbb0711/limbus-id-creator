using FluentValidation;
using Server.Features.Images;

namespace Server.Features.SaveInfo.DTO.Skills
{
    public class RequestCustomEffect:SkillRequestBase
    {
        public string Name { get; set; } = "";
        public string CustomImg { get; set; } = "";
        public Guid CustomImgId { get; set; } = Guid.NewGuid();
        public string EffectColor { get; set; } = "#F1F1F1";
        public string Effect { get; set; } = "";
        public bool IsCoinType { get; set; } = false;
    }

    public class RequestCustomEffectValidator : AbstractValidator<RequestCustomEffect>
    {
        public RequestCustomEffectValidator()
        {
            RuleFor(r=>r.CustomImg)
                .MustAsync(async (image, _)=> await FileHelper.CheckUrlSize(image, 100 * 1024))
                .WithMessage("Skill icon and custom effect icon size must be <= 100kb");
        }
    }
}
