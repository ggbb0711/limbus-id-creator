

namespace Server.Shared.CloudStorage.Service
{
    public interface IUploadService
    {
        Task<string> Upload(byte[] file,string fileName);
        Task<string> Upload(string url, string fileName);
        Task<string> Upload(IFormFile file, string fileName);
    }
}
