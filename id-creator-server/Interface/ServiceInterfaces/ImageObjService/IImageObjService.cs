

using Server.Models;
using Server.Util.Enums;

namespace Server.Interface.ServiceInterface.ImageObjService
{
    public interface IImageObjService
    {
        public Task<ImageObj?> UpdateImage(Guid Id, string newUrl, DateTime lastUpdated);
        public Task<List<ImageObj>> GetImagesByStatus(AssetStatus status);
        public Task<ImageObj> DeleteImage(Guid id);
    }
}