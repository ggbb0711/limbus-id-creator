

using Server.Models;

namespace Server.Interface.Repositories
{
    public interface IUploadingImageRepository
    {
        Task UploadImage(UploadingImage img);
        Task DeleteImage(Guid id);
        Task<UploadingImage> Deque();
    }
}