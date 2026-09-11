


using Microsoft.EntityFrameworkCore;
using Server.Features.Images.Enum;
using Server.Shared.Database;
using Server.Shared.Model;
using Server.Shared.Repository;

namespace Server.Features.Images.Repository
{
    public class ImageObjRepository(ServerDbContext ctx) : Repository<ImageObj>(ctx), IImageObjRepository
    {

        public async Task<List<ImageObj>> GetAllImagesByStatus(AssetStatus status = AssetStatus.Uploaded)
        {
            return await _ctx.ImageObjs.Where(i=>i.Status == status).ToListAsync();
        }
    }
}
