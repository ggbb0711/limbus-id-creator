

using Server.Features.Images.Enum;
using Server.Shared.Model;
using Server.Shared.Repository;

namespace Server.Features.Images.Repository
{
    public interface IImageObjRepository : IRepository<ImageObj>
    {
        Task<List<ImageObj>> GetAllImagesByStatus(AssetStatus status);
    }
}
