using Server.Features.SaveInfo.Enum;
using Server.Features.SaveInfo.JsonConverter;

namespace Server.Features.SaveInfo.DTO.Skills
{
    [System.Text.Json.Serialization.JsonConverter(typeof(SkillRequestBaseConverter))]
    public abstract class SkillRequestBase
    {
        public Guid InputId { get; set; }
        public SkillType Type { get; set; }
        public int Index { get; set; }
    }
}