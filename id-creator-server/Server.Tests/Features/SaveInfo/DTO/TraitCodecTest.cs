using Server.Features.SaveInfo.DTO;

namespace Server.Tests.Features.SaveInfo.DTO
{
    public class TraitCodecTest
    {
        [Theory]
        [InlineData("Plain", false, """{"value":"Plain","crossed":false}""")]
        [InlineData("Gone", true, """{"value":"Gone","crossed":true}""")]
        public void Encode_SerializesTraitAsJson(string value, bool crossed, string expected) =>
            Assert.Equal(expected, TraitCodec.Encode(new TraitTagDTO { Value = value, Crossed = crossed }));

        [Theory]
        [InlineData("""{"value":"Gone","crossed":true}""", "Gone", true)]
        [InlineData("""{"value":"Plain","crossed":false}""", "Plain", false)]
        [InlineData("Plain", "Plain", false)]
        [InlineData("{oops", "{oops", false)]
        [InlineData("~~Gone~~", "~~Gone~~", false)]
        [InlineData("123", "123", false)]
        [InlineData("null", "null", false)]
        public void Decode_ParsesJsonOrFallsBackToLegacyString(string stored, string value, bool crossed)
        {
            var trait = TraitCodec.Decode(stored);
            Assert.Equal(value, trait.Value);
            Assert.Equal(crossed, trait.Crossed);
        }
    }
}
