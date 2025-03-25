using Microsoft.EntityFrameworkCore;
using RepositoryLayer.Models;
using RepositoryLayer.Repositories.Interface;

namespace RepositoryLayer.Repositories
{
    public class ImageObjRepository(ServerDbContext ctx) : IImageObjRepository
    {

        public async Task<ImageObj?> GetImageObj(Guid imgId)
        {
            return await ctx.ImageObjs.Where(x => x.Id == imgId).FirstOrDefaultAsync();
        }

        public async Task<ImageObj?> UpdateImage(Guid imgId, string newUrl)
        {
            var image = await ctx.ImageObjs.Where(x => x.Id == imgId).FirstOrDefaultAsync();

            if (image == null) return image;
            image.Url = newUrl;
            image.LastUpdated = DateTime.Now;
            await ctx.SaveChangesAsync();
            return image;
        }
    }
}
