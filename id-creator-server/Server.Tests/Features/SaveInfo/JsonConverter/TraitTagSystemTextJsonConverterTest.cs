using System.Text.Json;
using Server.Features.SaveInfo.DTO;
using Server.Features.SaveInfo.JsonConverter;

namespace Server.Tests.Features.SaveInfo.JsonConverter
{
    public class TraitTagSystemTextJsonConverterTest
    {
        private readonly JsonSerializerOptions _options = new(JsonSerializerDefaults.Web)
        {
            Converters = { new TraitTagSystemTextJsonConverter() },
        };

        [Fact]
        public void Read_AcceptsLegacyStringsAndObjects()
        {
            var traits = JsonSerializer.Deserialize<List<TraitTagDTO>>("""["Old", {"value":"New","crossed":true}]""", _options)!;

            Assert.Collection(traits,
                t => { Assert.Equal("Old", t.Value); Assert.False(t.Crossed); },
                t => { Assert.Equal("New", t.Value); Assert.True(t.Crossed); });
        }

        [Fact]
        public void Write_UsesCamelCase() =>
            Assert.Equal("""{"value":"A","crossed":true}""", JsonSerializer.Serialize(new TraitTagDTO { Value = "A", Crossed = true }, _options));
    }
}
