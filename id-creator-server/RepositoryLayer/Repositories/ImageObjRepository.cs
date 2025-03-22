using RepositoryLayer.Models;
using RepositoryLayer.Repositories.Interface;

namespace RepositoryLayer.Repositories
{
    public class ImageObjRepository(ServerDbContext ctx) : IImageObjRepository
    {
        private readonly ServerDbContext _ctx = ctx;

        public async Task<ImageObj?> GetImageObj(Guid imgId)
        {
            return await _ctx.ImageObjs.Where(x => x.Id == imgId).FirstOrDefaultAsync();
        }

        public async Task<ImageObj?> UpdateImage(Guid imgId, string newUrl)
        {
            var image = await _ctx.ImageObjs.Where(x => x.Id == imgId).FirstOrDefaultAsync();

            if (image != null)
            {
                image.Url = newUrl;
                image.LastUpdated = DateTime.Now;
                await _ctx.SaveChangesAsync();
            }
            return image;
        }
    }
}
