

using Server.Features.Images.Enum;
using Server.Shared.Model;

namespace Server.Features.Images.Service
{
    public interface IImageObjService
    {
        public Task<ImageObj?> UpdateImage(ImageObj updatedImage);
        public Task<List<ImageObj>> GetImagesByStatus(AssetStatus status, int take = 10);
        public Task<ImageObj?> DeleteImage(Guid id);
        public Task<ImageObj?> DeleteImage(ImageObj id);
    }
}
