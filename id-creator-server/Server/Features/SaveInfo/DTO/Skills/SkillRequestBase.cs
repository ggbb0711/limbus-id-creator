using Server.Features.SaveInfo.Enum;

namespace Server.Features.SaveInfo.DTO.Skills
{
    public abstract class SkillRequestBase
    {
        public Guid InputId { get; set; }
        public SkillType Type { get; set; }
        public int Index { get; set; }
    }
}
