using Server.Features.SaveInfo.DTO;
using Server.Features.SaveInfo.Enum;

namespace Server.Tests.Features.SaveInfo.DTO
{
    public class SavedIDRequestDTOValidatorTest
    {
        private const string LayoutMessage = "Card layout must be Horizontal or Vertical";
        private const string WidthMessage = "Card width must be between 900 and 3200";
        private const string HeightMessage = "Card height must be between 700 and 3000";

        private static readonly SavedIDRequestDTOValidator Validator = new();

        private static SavedIDRequestDTO CreateSave(CardLayout layout = CardLayout.Horizontal, int width = 1440, int height = 1000) => new()
        {
            SplashArt = "splash.png",
            SinnerIcon = "sinner.png",
            SplashArtTranslation = new SplashArtTranslationObj(),
            SkillDetails = [],
            CardLayout = layout,
            CardWidth = width,
            CardHeight = height,
        };

        [Fact]
        public async Task Validate_Passes_WithDefaultCardStyle()
        {
            var result = await Validator.ValidateAsync(CreateSave());

            Assert.True(result.IsValid, string.Join(" ", result.Errors.Select(e => e.ErrorMessage)));
        }

        [Theory]
        [InlineData(CardLayout.Horizontal)]
        [InlineData(CardLayout.Vertical)]
        public async Task Validate_Passes_ForEachLayout(CardLayout layout)
        {
            var result = await Validator.ValidateAsync(CreateSave(layout));

            Assert.True(result.IsValid, string.Join(" ", result.Errors.Select(e => e.ErrorMessage)));
        }

        [Fact]
        public async Task Validate_Fails_WhenLayoutIsNotDefined()
        {
            var result = await Validator.ValidateAsync(CreateSave((CardLayout)5));

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.ErrorMessage == LayoutMessage);
        }

        [Theory]
        [InlineData(900, true)]
        [InlineData(3200, true)]
        [InlineData(899, false)]
        [InlineData(2401, false)]
        public async Task Validate_ChecksWidthBounds(int width, bool valid)
        {
            var result = await Validator.ValidateAsync(CreateSave(width: width));

            Assert.Equal(valid, !result.Errors.Any(e => e.ErrorMessage == WidthMessage));
        }

        [Theory]
        [InlineData(700, true)]
        [InlineData(3000, true)]
        [InlineData(699, false)]
        [InlineData(2001, false)]
        public async Task Validate_ChecksHeightBounds(int height, bool valid)
        {
            var result = await Validator.ValidateAsync(CreateSave(height: height));

            Assert.Equal(valid, !result.Errors.Any(e => e.ErrorMessage == HeightMessage));
        }
    }
}
