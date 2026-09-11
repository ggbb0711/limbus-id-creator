

using Server.Features.Images.Enum;
using Server.Shared.Model;

namespace Server.Features.Images.Service
{
    public interface IImageObjService
    {
        public Task<ImageObj?> UpdateImage(Guid Id, string newUrl, DateTime lastUpdated);
        public Task<List<ImageObj>> GetImagesByStatus(AssetStatus status);
        public Task<ImageObj?> DeleteImage(Guid id);
    }
}
