


using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Interface.Repositories;
using Server.Models;
using Server.Util.Enums;

namespace Server.Repositories
{
    public class ImageObjRepository(ServerDbContext ctx) : Repository<ImageObj>(ctx), IImageObjRepository
    {

        public async Task<List<ImageObj>> GetAllImagesByStatus(AssetStatus status = AssetStatus.Uploaded)
        {
            return await _ctx.ImageObjs.Where(i=>i.Status == status).ToListAsync();
        }
    }
}