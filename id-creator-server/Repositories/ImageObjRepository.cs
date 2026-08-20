


using Server.Data;
using Server.Interface.Repositories;
using Server.Models;

namespace Server.Repositories
{
    public class ImageObjRepository(ServerDbContext ctx) : Repository<ImageObj>(ctx), IImageObjRepository
    {
    }
}