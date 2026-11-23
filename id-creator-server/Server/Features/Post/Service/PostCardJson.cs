using System.Text.Json;
using System.Text.Json.Serialization;
using Server.Features.SaveInfo.JsonConverter;

namespace Server.Features.Post.Service
{
    public static class PostCardJson
    {
        public static readonly JsonSerializerOptions Options = new(JsonSerializerDefaults.Web)
        {
            Converters =
            {
                new JsonStringEnumConverter(),
                new SkillRequestBaseSystemTextJsonConverter(),
                new TraitTagSystemTextJsonConverter(),
            },
        };
    }
}
