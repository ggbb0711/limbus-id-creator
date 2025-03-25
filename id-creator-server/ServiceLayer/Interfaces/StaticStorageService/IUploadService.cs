

namespace ServiceLayer.Interfaces.StaticStorageService
{
    public interface IUploadService
    {
        Task<string> Upload(byte[] file,string fileName);
        Task<string> Upload(string url, string fileName);
    }
}