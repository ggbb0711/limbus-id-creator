

using RepositoryLayer.Models;

namespace RepositoryLayer.Repositories.Interface
{
    public interface IImageObjRepository
    {
        Task<ImageObj?> GetImageObj(Guid imgId);
        Task<ImageObj?> UpdateImage(Guid imgId,string newUrl);
    }
}