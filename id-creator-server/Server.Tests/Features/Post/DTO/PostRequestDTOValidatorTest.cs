using Server.Features.Post.DTO;
using Server.Shared.Model;

namespace Server.Tests.Features.Post.DTO
{
    public class PostRequestDTOValidatorTest
    {
        private const string CountMessage = "Post must have between 1 and 8 images";
        private const string SaveMessage = "Each image must come from a cloud save";
        private const string KindMessage = "Each image must be an Identity or an Ego";

        private static readonly PostRequestDTOValidator Validator = new();

        private static PostRequestDTO CreatePost(params PostCardRequestDTO[] cards) => new()
        {
            Title = "New Post",
            Cards = [.. cards],
        };

        private static PostCardRequestDTO Card(PostCardKind kind = PostCardKind.Identity) => new() { SaveId = Guid.NewGuid(), Kind = kind };

        [Fact]
        public async Task Validate_Passes_WithIdentityAndEgoCards()
        {
            var result = await Validator.ValidateAsync(CreatePost(Card(), Card(PostCardKind.Ego)));

            Assert.True(result.IsValid, string.Join(" ", result.Errors.Select(e => e.ErrorMessage)));
        }

        [Theory]
        [InlineData(0)]
        [InlineData(9)]
        public async Task Validate_Fails_WhenCardCountOutOfRange(int count)
        {
            var cards = Enumerable.Range(0, count).Select(_ => Card()).ToArray();

            var result = await Validator.ValidateAsync(CreatePost(cards));

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.ErrorMessage == CountMessage);
        }

        [Fact]
        public async Task Validate_Fails_WhenSaveIdIsEmpty()
        {
            var result = await Validator.ValidateAsync(CreatePost(new PostCardRequestDTO { SaveId = Guid.Empty, Kind = PostCardKind.Identity }));

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.ErrorMessage == SaveMessage);
        }

        [Fact]
        public async Task Validate_Fails_WhenKindIsUnknown()
        {
            var result = await Validator.ValidateAsync(CreatePost(new PostCardRequestDTO { SaveId = Guid.NewGuid(), Kind = (PostCardKind)7 }));

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.ErrorMessage == KindMessage);
        }
    }
}
