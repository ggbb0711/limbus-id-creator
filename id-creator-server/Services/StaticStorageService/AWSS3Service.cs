using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Transfer;
using Server.Interface.ServiceInterface.StaticStorageService;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;

namespace Server.Services
{
    public class AWSS3Service : IUploadService, IDeleteService
    {
        private readonly AmazonS3Client _amazonS3Client;
        private readonly TransferUtility _transferUtility;
        private readonly string AWS_S3_BUCKET_NAME = Environment.GetEnvironmentVariable("AWS_S3_BUCKET_NAME");
        public AWSS3Service(){
            var AWS_ACCESS_KEY = Environment.GetEnvironmentVariable("AWS_ACCESS_KEY");
            var AWS_SECRET_KEY = Environment.GetEnvironmentVariable("AWS_SECRET_KEY");
            var credentials = new BasicAWSCredentials(AWS_ACCESS_KEY, AWS_SECRET_KEY);
            var config = new AmazonS3Config()
            {
                RegionEndpoint = RegionEndpoint.USEast1
            };

            _amazonS3Client = new AmazonS3Client(credentials);
            _transferUtility = new TransferUtility(_amazonS3Client);
        }

        public async Task Delete(string publicId)
        {
            await _amazonS3Client.DeleteObjectAsync(AWS_S3_BUCKET_NAME, publicId);
        }

        public async Task<string> Upload(byte[] file, string fileName)
        {
            using var image = Image.Load(file);
            using var webpStream = new MemoryStream();
            await image.SaveAsync(webpStream, new WebpEncoder { Quality = 70 });
            webpStream.Position = 0;

            var uploadRequest = new TransferUtilityUploadRequest
            {
                InputStream = webpStream,
                BucketName = AWS_S3_BUCKET_NAME,
                ContentType = "image/webp",
                Key = fileName
            };

            await _transferUtility.UploadAsync(uploadRequest);
            return $"https://{AWS_S3_BUCKET_NAME}.s3.{_amazonS3Client.Config.RegionEndpoint.SystemName}.amazonaws.com/{fileName}";
        }

        public async Task<string> Upload(string url, string fileName)
        {
            var byteData = await (new HttpClient()).GetByteArrayAsync(url);
            return await Upload(byteData, fileName);
        }
    }
}