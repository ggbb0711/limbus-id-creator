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
    public class DeleteImagesBackgroundServiceTest
    {
        private static Task InvokeDoWork(DeleteImagesBackgroundService service)
        {
            var method = typeof(DeleteImagesBackgroundService)
                .GetMethod("DoWork", BindingFlags.NonPublic | BindingFlags.Instance)!;
            return (Task)method.Invoke(service, null)!;
        }

        private static ImageObj CreateImage() => new() { Id = Guid.NewGuid(), Status = AssetStatus.Deleted };

        [Fact]
        public async Task DoWork_DeletesCloudImageAndRecord_ForEveryImageWithDeletedStatus()
        {
            var image1 = CreateImage();
            var image2 = CreateImage();

            var deleteService = new Mock<IDeleteService>();
            var imageObjService = new Mock<IImageObjService>();
            imageObjService.Setup(s => s.GetImagesByStatus(AssetStatus.Deleted,500)).ReturnsAsync([image1, image2]);
            deleteService.Setup(s => s.Delete(It.IsAny<string>())).Returns(Task.CompletedTask);
            imageObjService.Setup(s => s.DeleteImage(It.IsAny<ImageObj>())).ReturnsAsync((ImageObj?)null);

            var provider = new ServiceCollection()
                .AddSingleton(deleteService.Object)
                .AddSingleton(imageObjService.Object)
                .BuildServiceProvider();

            await InvokeDoWork(new DeleteImagesBackgroundService(provider));

            deleteService.Verify(s => s.Delete(image1.Id.ToString()), Times.Once);
            deleteService.Verify(s => s.Delete(image2.Id.ToString()), Times.Once);
            imageObjService.Verify(s => s.DeleteImage(image1), Times.Once);
            imageObjService.Verify(s => s.DeleteImage(image2), Times.Once);
        }

        [Fact]
        public async Task DoWork_CallsNothing_WhenNoImagesHaveDeletedStatus()
        {
            var deleteService = new Mock<IDeleteService>();
            var imageObjService = new Mock<IImageObjService>();
            imageObjService.Setup(s => s.GetImagesByStatus(AssetStatus.Deleted,500)).ReturnsAsync([]);

            var provider = new ServiceCollection()
                .AddSingleton(deleteService.Object)
                .AddSingleton(imageObjService.Object)
                .BuildServiceProvider();

            await InvokeDoWork(new DeleteImagesBackgroundService(provider));

            deleteService.Verify(s => s.Delete(It.IsAny<string>()), Times.Never);
            imageObjService.Verify(s => s.DeleteImage(It.IsAny<ImageObj>()), Times.Never);
        }
    }
}
