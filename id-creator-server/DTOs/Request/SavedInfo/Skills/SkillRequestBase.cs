using System.Text.Json.Serialization;
using Server.Util.Enums;
using Server.Util.JsonConverter;

namespace Server.DTOs.Request.SavedInfo.Skills
{
    [JsonConverter(typeof(SkillRequestBaseConverter))]
    public abstract class SkillRequestBase
    {
        public Guid inputId { get; set; }
        public SkillType type { get; set; }
    }
}