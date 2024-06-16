

namespace Server.Interface.ServiceInterface.UploadService
{
    public interface IUploadService
    {
        Task<string> Upload(IFormFile file,string fileName);
    }
}