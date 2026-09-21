using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using Moq;
using Server.Shared.CloudStorage.Service;
using Server.Tests.Features.SaveInfo;

namespace Server.Tests.Shared.CloudStorage.Service
{
    public class AWSS3ServiceTest
    {
        private const string BucketName = "test-bucket";

        private static (Mock<IAmazonS3> S3Client, Mock<ITransferUtility> TransferUtility, AWSS3Service Service) CreateService()
        {
            var s3Client = new Mock<IAmazonS3>();
            s3Client.Setup(c => c.Config).Returns(new AmazonS3Config { RegionEndpoint = RegionEndpoint.USEast1 });
            var transferUtility = new Mock<ITransferUtility>();
            var service = new AWSS3Service(s3Client.Object, transferUtility.Object, BucketName);

            return (s3Client, transferUtility, service);
        }

        [Fact]
        public async Task Upload_WithByteArray_ReturnsExpectedUrl_AndUploadsToTransferUtility()
        {
            var (_, transferUtility, service) = CreateService();
            var fileName = "image.webp";
            var bytes = "file-content"u8.ToArray();
            transferUtility
                .Setup(t => t.UploadAsync(It.IsAny<TransferUtilityUploadRequest>(), It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            var result = await service.Upload(bytes, fileName);

            Assert.Equal($"https://{BucketName}.s3.us-east-1.amazonaws.com/{fileName}", result);
            transferUtility.Verify(
                t => t.UploadAsync(
                    It.Is<TransferUtilityUploadRequest>(r =>
                        r.BucketName == BucketName &&
                        r.Key == fileName &&
                        r.ContentType == "image/webp"),
                    It.IsAny<CancellationToken>()),
                Times.Once);
        }

        [Fact]
        public async Task Upload_WithFormFile_ReturnsExpectedUrl_AndUploadsConvertedBytes()
        {
            var (_, transferUtility, service) = CreateService();
            var fileName = "avatar.webp";
            var bytes = "form-file-content"u8.ToArray();
            var formFile = MockSaveData.CreateFakeFormFile(bytes).Object;

            string? capturedContent = null;
            string? capturedBucketName = null;
            string? capturedKey = null;
            transferUtility
                .Setup(t => t.UploadAsync(It.IsAny<TransferUtilityUploadRequest>(), It.IsAny<CancellationToken>()))
                .Callback<TransferUtilityUploadRequest, CancellationToken>((r, _) =>
                {
                    capturedContent = new StreamReader(r.InputStream).ReadToEnd();
                    capturedBucketName = r.BucketName;
                    capturedKey = r.Key;
                })
                .Returns(Task.CompletedTask);

            var result = await service.Upload(formFile, fileName);

            Assert.Equal($"https://{BucketName}.s3.us-east-1.amazonaws.com/{fileName}", result);
            Assert.Equal("form-file-content", capturedContent);
            Assert.Equal(BucketName, capturedBucketName);
            Assert.Equal(fileName, capturedKey);
        }

        [Fact]
        public async Task Delete_CallsDeleteObjectAsync_WithBucketNameAndPublicId()
        {
            var (s3Client, _, service) = CreateService();
            s3Client
                .Setup(c => c.DeleteObjectAsync(BucketName, "public-id", It.IsAny<CancellationToken>()))
                .ReturnsAsync(new DeleteObjectResponse());

            await service.Delete("public-id");

            s3Client.Verify(
                c => c.DeleteObjectAsync(BucketName, "public-id", It.IsAny<CancellationToken>()),
                Times.Once);
        }
    }
}
