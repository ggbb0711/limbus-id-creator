

using Server.Models;

namespace Server.Interface.Repositories
{
    public interface IImageObjRepository
    {
        Task<ImageObj?> GetImageObj(Guid imgId);
        Task<ImageObj?> UpdateImage(Guid imgId,string newUrl);
    }
}