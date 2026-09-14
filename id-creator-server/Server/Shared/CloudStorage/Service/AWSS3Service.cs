using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Transfer;
using Server.Features.Images;
using Server.Shared.Config;

namespace Server.Shared.CloudStorage.Service
{
    public class AWSS3Service : IUploadService, IDeleteService
    {
        private readonly AmazonS3Client _amazonS3Client;
        private readonly TransferUtility _transferUtility;
        private readonly string AWS_S3_BUCKET_NAME;
        public AWSS3Service(EnvironmentVariables env){
            var AWS_ACCESS_KEY = env.AwsAccessKey;
            var AWS_SECRET_KEY = env.AwsSecretKey;
            var credentials = new BasicAWSCredentials(AWS_ACCESS_KEY, AWS_SECRET_KEY);
            var config = new AmazonS3Config()
            {
                RegionEndpoint = RegionEndpoint.USEast1
            };

            _amazonS3Client = new AmazonS3Client(credentials, config);
            _transferUtility = new TransferUtility(_amazonS3Client);
            AWS_S3_BUCKET_NAME = env.AwsS3BucketName;
        }

        public async Task Delete(string publicId)
        {
            await _amazonS3Client.DeleteObjectAsync(AWS_S3_BUCKET_NAME, publicId);
        }

        public async Task<string> Upload(byte[] file, string fileName)
        {
            using var stream = new MemoryStream(file);
            var uploadRequest = new TransferUtilityUploadRequest
            {
                InputStream = stream,
                BucketName = AWS_S3_BUCKET_NAME,
                ContentType = "image/webp",
                Key = fileName
            };

            await _transferUtility.UploadAsync(uploadRequest);
            return $"https://{AWS_S3_BUCKET_NAME}.s3.{_amazonS3Client.Config.RegionEndpoint.SystemName}.amazonaws.com/{fileName}";
        }

        public async Task<string> Upload(string url, string fileName)
        {
            var byteData = await new HttpClient().GetByteArrayAsync(url);
            return await Upload(byteData, fileName);
        }

        public async Task<string> Upload(IFormFile file, string fileName)
        {
            var byteData = await FileHelper.ConvertToByteArray(file);
            return await Upload(byteData, fileName);
        }
    }
}
