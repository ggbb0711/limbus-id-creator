using FluentValidation;

namespace Server.Features.SaveInfo.DTO.Skills
{
    public class RequestOffenseSkill:ActiveSkillRequestBase
    {
        public int SkillLevel { get; set; } = 0;
        public int SkillAmt { get; set; } = 1;
        public int AtkWeight { get; set; } = 1;
        public string DamageType { get; set; } = "Slash";

    }

    public class RequestOffenseSkillValidator : AbstractValidator<RequestOffenseSkill>
    {
        public RequestOffenseSkillValidator() => Include(new ActiveSkillRequestBaseValidator());
    }
}
