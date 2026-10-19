using System.Text.Json;

namespace Server.Features.SaveInfo.DTO
{
    public class TraitTagDTO
    {
        public string Value { get; set; } = "";
        public bool Crossed { get; set; }
    }

    public static class TraitCodec
    {
        private static readonly JsonSerializerOptions Options = new(JsonSerializerDefaults.Web);

        public static string Encode(TraitTagDTO trait) => JsonSerializer.Serialize(trait, Options);

        public static TraitTagDTO Decode(string stored)
        {
            try
            {
                return JsonSerializer.Deserialize<TraitTagDTO>(stored, Options)
                    ?? new TraitTagDTO { Value = stored, Crossed = false };
            }
            catch (JsonException)
            {
                return new TraitTagDTO { Value = stored, Crossed = false };
            }
        }
    }
}
