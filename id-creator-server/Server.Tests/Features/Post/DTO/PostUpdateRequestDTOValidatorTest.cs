using Server.Features.Post.DTO;
using Server.Shared.Model;

namespace Server.Tests.Features.Post.DTO
{
    public class PostUpdateRequestDTOValidatorTest
    {
        private static readonly PostUpdateRequestDTOValidator Validator = new();

        private static PostUpdateRequestDTO Update(params PostCardUpdateDTO[] cards) => new() { Cards = [.. cards] };

        private static PostCardUpdateDTO Keep(Guid? id = null) => new() { CardId = id ?? Guid.NewGuid() };

        private static PostCardUpdateDTO FromSave(PostCardKind? kind = PostCardKind.Identity) => new() { SaveId = Guid.NewGuid(), Kind = kind };

        [Fact]
        public async Task Validate_Passes_WithKeptAndNewCards()
        {
            var result = await Validator.ValidateAsync(Update(Keep(), FromSave(PostCardKind.Ego)));

            Assert.True(result.IsValid, string.Join(" ", result.Errors.Select(e => e.ErrorMessage)));
        }

        [Theory]
        [InlineData(1, true)]
        [InlineData(8, true)]
        [InlineData(0, false)]
        [InlineData(9, false)]
        public async Task Validate_ChecksCardCount(int count, bool valid)
        {
            var result = await Validator.ValidateAsync(Update([.. Enumerable.Range(0, count).Select(_ => Keep())]));

            Assert.Equal(valid, result.IsValid);
        }

        public static TheoryData<PostCardUpdateDTO> InvalidCards => new()
        {
            new PostCardUpdateDTO(),
            new PostCardUpdateDTO { CardId = Guid.NewGuid(), SaveId = Guid.NewGuid(), Kind = PostCardKind.Identity },
            new PostCardUpdateDTO { CardId = Guid.Empty },
            new PostCardUpdateDTO { SaveId = Guid.Empty, Kind = PostCardKind.Identity },
            new PostCardUpdateDTO { SaveId = Guid.NewGuid() },
            new PostCardUpdateDTO { SaveId = Guid.NewGuid(), Kind = (PostCardKind)7 },
        };

        [Theory]
        [MemberData(nameof(InvalidCards))]
        public async Task Validate_Fails_WhenCardSourceIsInvalid(PostCardUpdateDTO card)
        {
            var result = await Validator.ValidateAsync(Update(card));

            Assert.False(result.IsValid);
        }

        [Fact]
        public async Task Validate_Fails_WhenSameCardIsKeptTwice()
        {
            var id = Guid.NewGuid();

            var result = await Validator.ValidateAsync(Update(Keep(id), Keep(id)));

            Assert.Contains(result.Errors, e => e.ErrorMessage == "Each image can only appear once");
        }

        [Fact]
        public async Task Validate_Fails_WithTooManyTags()
        {
            var dto = Update(Keep());
            dto.Tags = [.. Enumerable.Range(0, 22).Select(i => $"tag{i}")];

            var result = await Validator.ValidateAsync(dto);

            Assert.Contains(result.Errors, e => e.ErrorMessage == "Post cannot have more than 22 tags");
        }
    }
}
