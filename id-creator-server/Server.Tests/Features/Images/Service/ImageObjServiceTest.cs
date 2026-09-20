using Moq;
using Server.Features.Images.Enum;
using Server.Features.Images.Repository;
using Server.Features.Images.Service;
using Server.Shared.Model;

namespace Server.Tests.Features.Images.Service
{
    public class ImageObjServiceTest
    {
        [Fact]
        public async Task GetImagesByStatus_ReturnsRepositoryResult()
        {
            var images = new List<ImageObj> { new() { Id = Guid.NewGuid() } };
            var repository = new Mock<IImageObjRepository>();
            repository.Setup(r => r.GetAllImagesByStatus(AssetStatus.Pending)).ReturnsAsync(images);

            var service = new ImageObjService(repository.Object);
            var result = await service.GetImagesByStatus(AssetStatus.Pending);

            Assert.Same(images, result);
            repository.Verify(r => r.GetAllImagesByStatus(AssetStatus.Pending), Times.Once);
        }

        [Fact]
        public async Task DeleteImage_RemovesAndReturnsImage_WhenFound()
        {
            var image = new ImageObj { Id = Guid.NewGuid() };
            var repository = new Mock<IImageObjRepository>();
            repository.Setup(r => r.GetByIdAsync(image.Id)).ReturnsAsync(image);
            repository.Setup(r => r.RemoveAsync(image)).Returns(Task.CompletedTask);

            var service = new ImageObjService(repository.Object);
            var result = await service.DeleteImage(image.Id);

            Assert.Same(image, result);
            repository.Verify(r => r.RemoveAsync(image), Times.Once);
            repository.Verify(r => r.SaveChangeAsync(), Times.Once);
        }

        [Fact]
        public async Task DeleteImage_ReturnsNull_WhenNotFound()
        {
            var id = Guid.NewGuid();
            var repository = new Mock<IImageObjRepository>();
            repository.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((ImageObj?)null);

            var service = new ImageObjService(repository.Object);
            var result = await service.DeleteImage(id);

            Assert.Null(result);
            repository.Verify(r => r.RemoveAsync(It.IsAny<ImageObj>()), Times.Never);
        }

        [Fact]
        public async Task UpdateImage_ReturnsNull_WhenImageNotFound()
        {
            var updateImage = new ImageObj { Id = Guid.NewGuid(), LastUpdated = DateTime.UtcNow };
            var repository = new Mock<IImageObjRepository>();
            repository.Setup(r => r.GetByIdAsync(updateImage.Id)).ReturnsAsync((ImageObj?)null);

            var service = new ImageObjService(repository.Object);
            var result = await service.UpdateImage(updateImage);

            Assert.Null(result);
            repository.Verify(r => r.UpdateAsync(It.IsAny<ImageObj>()), Times.Never);
            repository.Verify(r => r.SaveChangeAsync(), Times.Never);
        }

        [Fact]
        public async Task UpdateImage_ReturnsNull_WhenLastUpdatedDoesNotMatch()
        {
            var id = Guid.NewGuid();
            var foundImage = new ImageObj { Id = id, LastUpdated = new DateTime(2024, 1, 1) };
            var updateImage = new ImageObj { Id = id, LastUpdated = new DateTime(2024, 2, 1), Url = "https://example.com/img.png" };
            var repository = new Mock<IImageObjRepository>();
            repository.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(foundImage);

            var service = new ImageObjService(repository.Object);
            var result = await service.UpdateImage(updateImage);

            Assert.Null(result);
            repository.Verify(r => r.UpdateAsync(It.IsAny<ImageObj>()), Times.Never);
            repository.Verify(r => r.SaveChangeAsync(), Times.Never);
        }

        [Fact]
        public async Task UpdateImage_AppendsVersionWithQuestionMark_WhenUrlHasNoQueryString()
        {
            var id = Guid.NewGuid();
            var lastUpdated = new DateTime(2024, 1, 1);
            var foundImage = new ImageObj { Id = id, LastUpdated = lastUpdated, Url = "https://example.com/old.png" };
            var updateImage = new ImageObj { Id = id, LastUpdated = lastUpdated, Url = "https://example.com/new.png" };
            var repository = new Mock<IImageObjRepository>();
            repository.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(foundImage);
            repository.Setup(r => r.UpdateAsync(foundImage)).ReturnsAsync(foundImage);
            repository.Setup(r => r.SaveChangeAsync()).Returns(Task.CompletedTask);

            var service = new ImageObjService(repository.Object);
            var result = await service.UpdateImage(updateImage);

            Assert.Same(foundImage, result);
            Assert.Equal($"https://example.com/new.png?v={lastUpdated.Ticks}", foundImage.Url);
            Assert.Equal(lastUpdated, foundImage.LastUpdated);
            repository.Verify(r => r.UpdateAsync(foundImage), Times.Once);
            repository.Verify(r => r.SaveChangeAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdateImage_AppendsVersionWithAmpersand_WhenUrlAlreadyHasQueryString()
        {
            var id = Guid.NewGuid();
            var lastUpdated = new DateTime(2024, 1, 1);
            var foundImage = new ImageObj { Id = id, LastUpdated = lastUpdated, Url = "https://example.com/old.png" };
            var updateImage = new ImageObj { Id = id, LastUpdated = lastUpdated, Url = "https://example.com/new.png?size=large" };
            var repository = new Mock<IImageObjRepository>();
            repository.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(foundImage);
            repository.Setup(r => r.UpdateAsync(foundImage)).ReturnsAsync(foundImage);
            repository.Setup(r => r.SaveChangeAsync()).Returns(Task.CompletedTask);

            var service = new ImageObjService(repository.Object);
            await service.UpdateImage(updateImage);

            Assert.Equal($"https://example.com/new.png?size=large&v={lastUpdated.Ticks}", foundImage.Url);
        }
    }
}
