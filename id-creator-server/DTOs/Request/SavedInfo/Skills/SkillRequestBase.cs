using System.Text.Json.Serialization;
using Server.Util.Enums;
using Server.Util.JsonConverter;

namespace Server.DTOs.Request.SavedInfo.Skills
{
    [JsonConverter(typeof(SkillRequestBaseConverter))]
    public abstract class SkillRequestBase
    {
        public Guid InputId { get; set; }
        public SkillType Type { get; set; }
        public int Index { get; set; }
    }
}