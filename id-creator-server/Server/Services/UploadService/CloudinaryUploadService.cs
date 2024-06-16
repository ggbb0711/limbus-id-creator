



using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Server.Interface.ServiceInterface.UploadService;

namespace Server.Services
{
    public class CloudinaryUploadService:IUploadService
    {
        Cloudinary _cloudinary;
        public CloudinaryUploadService()
        {
            _cloudinary = new(Environment.GetEnvironmentVariable("CLOUDINARY_URL"));
            _cloudinary.Api.Secure = true;
        }

        public async Task<string> Upload(IFormFile file,string fileName)
        {
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            memoryStream.Position = 0;
            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(fileName, memoryStream),
                UseFilename = true,
                UniqueFilename = false,
                Overwrite = true,
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);
            
            return uploadResult.SecureUrl.ToString();
        }
    }
}