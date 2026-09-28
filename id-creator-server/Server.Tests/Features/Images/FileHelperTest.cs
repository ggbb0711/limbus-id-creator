using Server.Features.Images;

namespace Server.Tests.Features.Images
{
    public class FileHelperTest
    {
        private static string PngDataUrl(int byteCount) =>
            FileHelper.Base64PngPrefix + Convert.ToBase64String(new byte[byteCount]);

        [Fact]
        public async Task CheckUrlSize_ReturnsTrue_ForSmallBase64PngDataUrl()
        {
            Assert.True(await FileHelper.CheckUrlSize(PngDataUrl(100), 1024));
        }

        [Fact]
        public async Task CheckUrlSize_ReturnsTrue_ForLargeBase64PngDataUrlUnderLimit()
        {
            Assert.True(await FileHelper.CheckUrlSize(PngDataUrl(100_000), 7_000_000));
        }

        [Fact]
        public async Task CheckUrlSize_ReturnsFalse_WhenBase64PngDataUrlOverLimit()
        {
            Assert.False(await FileHelper.CheckUrlSize(PngDataUrl(2048), 1024));
        }

        [Fact]
        public async Task CheckUrlSize_ReturnsFalse_ForDataUrlWithInvalidBase64()
        {
            Assert.False(await FileHelper.CheckUrlSize(FileHelper.Base64PngPrefix + "not*base64", 1024));
        }

        [Fact]
        public void IsBase64DataUrl_ReturnsTrue_ForPngDataUrl()
        {
            Assert.True(FileHelper.IsBase64DataUrl(PngDataUrl(10)));
        }

        [Theory]
        [InlineData("data:image/jpeg;base64,AAAA")]
        [InlineData("not-an-image")]
        [InlineData("AAAA")]
        [InlineData("")]
        [InlineData("https://res.cloudinary.com/demo/image.png")]
        public void IsBase64DataUrl_ReturnsFalse_ForOtherStrings(string url)
        {
            Assert.False(FileHelper.IsBase64DataUrl(url));
        }

        [Theory]
        [InlineData(30)]
        [InlineData(31)]
        [InlineData(32)]
        public void GetBase64DecodedSize_MatchesDecodedLength(int byteCount)
        {
            var base64 = Convert.ToBase64String(new byte[byteCount]);

            Assert.Equal(Convert.FromBase64String(base64).Length, FileHelper.GetBase64DecodedSize(base64));
        }
    }
}
