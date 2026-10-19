using System.Text.Json;
using System.Text.Json.Serialization;
using Server.Features.SaveInfo.DTO;

namespace Server.Features.SaveInfo.JsonConverter
{
    public class TraitTagSystemTextJsonConverter : JsonConverter<TraitTagDTO>
    {
        public override TraitTagDTO Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType == JsonTokenType.String)
                return new TraitTagDTO { Value = reader.GetString() ?? "", Crossed = false };

            using var doc = JsonDocument.ParseValue(ref reader);
            var root = doc.RootElement;
            if (root.ValueKind != JsonValueKind.Object)
                throw new JsonException("Trait must be a string or an object.");

            var trait = new TraitTagDTO();
            foreach (var prop in root.EnumerateObject())
            {
                if (prop.NameEquals(PropertyName(nameof(TraitTagDTO.Value), options)) && prop.Value.ValueKind == JsonValueKind.String)
                    trait.Value = prop.Value.GetString() ?? "";
                else if (prop.NameEquals(PropertyName(nameof(TraitTagDTO.Crossed), options)) && prop.Value.ValueKind is JsonValueKind.True or JsonValueKind.False)
                    trait.Crossed = prop.Value.GetBoolean();
            }
            return trait;
        }

        public override void Write(Utf8JsonWriter writer, TraitTagDTO value, JsonSerializerOptions options)
        {
            writer.WriteStartObject();
            writer.WriteString(PropertyName(nameof(TraitTagDTO.Value), options), value.Value);
            writer.WriteBoolean(PropertyName(nameof(TraitTagDTO.Crossed), options), value.Crossed);
            writer.WriteEndObject();
        }

        private static string PropertyName(string name, JsonSerializerOptions options)
            => options.PropertyNamingPolicy?.ConvertName(name) ?? name;
    }
}
