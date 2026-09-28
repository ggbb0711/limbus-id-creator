using Server.Features.Images;
using Server.Features.Post.DTO;

namespace Server.Tests.Features.Post.DTO
{
    public class PostRequestDTOValidatorTest
    {
        private const string FormatMessage = "Post images must be an uploaded image URL or a PNG base64 image";
        private const string SizeMessage = "Post images must be <= 7mb";
        private const string CountMessage = "Post must have between 1 and 8 images";

        private static readonly PostRequestDTOValidator Validator = new();

        private static string PngDataUrl(int byteCount) =>
            FileHelper.Base64PngPrefix + Convert.ToBase64String(new byte[byteCount]);

        private static PostRequestDTO CreatePost(params string[] images) => new()
        {
            Title = "New Post",
            ImagesAttach = [.. images],
        };

        [Fact]
        public async Task Validate_Passes_WhenImageIsNotYetUploadedBase64Png()
        {
            var result = await Validator.ValidateAsync(CreatePost(PngDataUrl(100_000)));

            Assert.True(result.IsValid, string.Join(" ", result.Errors.Select(e => e.ErrorMessage)));
        }

        [Theory]
        [InlineData("not-an-image")]
        [InlineData("data:image/jpeg;base64,AAAA")]
        public async Task Validate_Fails_WhenImageIsNotAUrlOrPngBase64(string image)
        {
            var result = await Validator.ValidateAsync(CreatePost(image));

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.ErrorMessage == FormatMessage);
        }

        [Fact]
        public async Task Validate_Fails_WhenBase64ImageOver7mb()
        {
            var result = await Validator.ValidateAsync(CreatePost(PngDataUrl(7_000_001)));

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.ErrorMessage == SizeMessage);
        }

        [Theory]
        [InlineData(0)]
        [InlineData(9)]
        public async Task Validate_Fails_WhenImageCountOutOfRange(int count)
        {
            var images = Enumerable.Range(0, count).Select(_ => PngDataUrl(10)).ToArray();

            var result = await Validator.ValidateAsync(CreatePost(images));

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.ErrorMessage == CountMessage);
        }
    }
}
