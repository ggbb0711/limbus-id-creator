using System.Reflection;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Server.Features.Images.Background;
using Server.Features.Images.Enum;
using Server.Features.Images.Service;
using Server.Shared.CloudStorage.Service;
using Server.Shared.Model;

namespace Server.Tests.Features.Images.Background
{
    public class UploadImagesBackgroundServiceTest
    {
        private static Task InvokeDoWork(UploadImagesBackgroundService service)
        {
            var method = typeof(UploadImagesBackgroundService)
                .GetMethod("DoWork", BindingFlags.NonPublic | BindingFlags.Instance)!;
            return (Task)method.Invoke(service, null)!;
        }

        [Fact]
        public async Task DoWork_UploadsAndUpdates_OnlyImagesWithValidBase64Url()
        {
            var base64Bytes = "pending-image-content"u8.ToArray();
            var pendingImage = new ImageObj
            {
                Id = Guid.NewGuid(),
                Status = AssetStatus.Pending,
                Url = "data:image/png;base64," + Convert.ToBase64String(base64Bytes),
            };
            var nonBase64Image = new ImageObj
            {
                Id = Guid.NewGuid(),
                Status = AssetStatus.Pending,
                Url = "https://example.com/already-hosted.png",
            };
            var uploadedUrl = "https://bucket.s3.amazonaws.com/uploaded.webp";

            var uploadService = new Mock<IUploadService>();
            var imageObjService = new Mock<IImageObjService>();
            imageObjService.Setup(s => s.GetImagesByStatus(AssetStatus.Pending,500)).ReturnsAsync([pendingImage, nonBase64Image]);
            uploadService.Setup(s => s.Upload(It.IsAny<byte[]>(), It.IsAny<string>())).ReturnsAsync(uploadedUrl);
            imageObjService.Setup(s => s.UpdateImage(It.IsAny<ImageObj>())).ReturnsAsync((ImageObj img) => img);

            var provider = new ServiceCollection()
                .AddSingleton(uploadService.Object)
                .AddSingleton(imageObjService.Object)
                .BuildServiceProvider();

            await InvokeDoWork(new UploadImagesBackgroundService(provider));

            uploadService.Verify(
                s => s.Upload(
                    It.Is<byte[]>(b => b.SequenceEqual(base64Bytes)),
                    pendingImage.Id.ToString()),
                Times.Once);
            imageObjService.Verify(
                s => s.UpdateImage(It.Is<ImageObj>(i =>
                    i.Id == pendingImage.Id && i.Url == uploadedUrl && i.Status == AssetStatus.Uploaded)),
                Times.Once);

            uploadService.Verify(s => s.Upload(It.IsAny<byte[]>(), nonBase64Image.Id.ToString()), Times.Never);
            imageObjService.Verify(
                s => s.UpdateImage(It.Is<ImageObj>(i => i.Id == nonBase64Image.Id)),
                Times.Never);
        }

        [Fact]
        public async Task DoWork_CallsNothing_WhenNoImagesHavePendingStatus()
        {
            var uploadService = new Mock<IUploadService>();
            var imageObjService = new Mock<IImageObjService>();
            imageObjService.Setup(s => s.GetImagesByStatus(AssetStatus.Pending,500)).ReturnsAsync([]);

            var provider = new ServiceCollection()
                .AddSingleton(uploadService.Object)
                .AddSingleton(imageObjService.Object)
                .BuildServiceProvider();

            await InvokeDoWork(new UploadImagesBackgroundService(provider));

            uploadService.Verify(s => s.Upload(It.IsAny<byte[]>(), It.IsAny<string>()), Times.Never);
            imageObjService.Verify(s => s.UpdateImage(It.IsAny<ImageObj>()), Times.Never);
        }
    }
}
