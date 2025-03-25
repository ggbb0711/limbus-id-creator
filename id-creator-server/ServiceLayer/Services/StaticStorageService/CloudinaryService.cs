using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using ServiceLayer.Interfaces.StaticStorageService;
using ServiceLayer.Util;

namespace ServiceLayer.Services.StaticStorageService
{
    public class CloudinaryService:IUploadService,IDeleteService
    {
        Cloudinary _cloudinary;
        public CloudinaryService()
        {
            _cloudinary = new(Environment.GetEnvironmentVariable("CLOUDINARY_URL"));
            _cloudinary.Api.Secure = true;
        }

        public async Task Delete(string publicId)
        {
            await _cloudinary.DestroyAsync(new DeletionParams(publicId));
        }

        public async Task<string> Upload(byte[] file,string fileName)
        {
            using var memoryStream = new MemoryStream(file);
            memoryStream.Position = 0;
            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(fileName, memoryStream),
                UseFilename = true,
                UniqueFilename = false,
                Overwrite = true,
                Transformation = new Transformation().Quality(35).Chain().FetchFormat("auto")
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);
            
            return TransformUrl(uploadResult.SecureUrl.ToString());
        }

        public async Task<string> Upload(string url, string fileName)
        {
            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(url),
                PublicId = fileName,
                UniqueFilename = false,
                Overwrite = true,
                Transformation = new Transformation().Quality(35).Chain().FetchFormat("auto")
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);
            if(uploadResult.Error != null) return await Upload(await FileHelper.ConvertToByteArray(url),fileName);
            return TransformUrl(uploadResult.SecureUrl.ToString());
        }

        private string TransformUrl(string url)
        {
            var marker = "/upload/";
            var markerIndex = url.IndexOf(marker, StringComparison.OrdinalIgnoreCase);

            var modifiedUrl = url.Insert(markerIndex + marker.Length, "q_35/f_auto/");
            return modifiedUrl;
        }
    }
}