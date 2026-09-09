

using Server.Models;
using Server.Util.Enums;

namespace Server.Interface.Repositories
{
    public interface IImageObjRepository : IRepository<ImageObj>
    {
        Task<List<ImageObj>> GetAllImagesByStatus(AssetStatus status);
    }
}