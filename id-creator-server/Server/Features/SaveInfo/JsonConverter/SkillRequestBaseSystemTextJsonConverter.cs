using System.Text.Json;
using System.Text.Json.Serialization;
using Server.Features.SaveInfo.DTO.Skills;
using Server.Features.SaveInfo.Enum;

namespace Server.Features.SaveInfo.JsonConverter
{
    public class SkillRequestBaseSystemTextJsonConverter : JsonConverter<SkillRequestBase>
    {
        public override SkillRequestBase Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            using var doc = JsonDocument.ParseValue(ref reader);
            var root = doc.RootElement;
            if (!root.TryGetProperty("type", out var typeProp))
                throw new JsonException("Missing 'type' discriminator on skill object.");

            var type = JsonSerializer.Deserialize<SkillType>(typeProp.GetRawText(), options);
            var raw = root.GetRawText();

            return type switch
            {
                SkillType.OffenseSkill => JsonSerializer.Deserialize<RequestOffenseSkill>(raw, options)!,
                SkillType.DefenseSkill => JsonSerializer.Deserialize<RequestDefenseSkill>(raw, options)!,
                SkillType.PassiveSkill => JsonSerializer.Deserialize<RequestPassiveSkill>(raw, options)!,
                SkillType.CustomEffect => JsonSerializer.Deserialize<RequestCustomEffect>(raw, options)!,
                SkillType.MentalEffect => JsonSerializer.Deserialize<RequestMentalEffect>(raw, options)!,
                _ => throw new JsonException($"Unknown skill type: {type}")
            };
        }

        public override void Write(Utf8JsonWriter writer, SkillRequestBase value, JsonSerializerOptions options)
            => JsonSerializer.Serialize(writer, value, value.GetType(), options);
    }
}
