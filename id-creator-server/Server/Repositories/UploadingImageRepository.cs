





using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Interface.Repositories;
using Server.Models;

namespace Server.Repositories
{
    public class UploadingImageRepository(ServerDbContext ctx) : IUploadingImageRepository
    {
        private readonly ServerDbContext _ctx = ctx;
        public async Task DeleteImage(Guid id)
        {
            var deleteImage = await _ctx.UploadingImages.Where(img => img.Id == id).FirstOrDefaultAsync();
            if(deleteImage != null)
            {
                _ctx.UploadingImages.Remove(deleteImage);
                await _ctx.SaveChangesAsync();
            }
        }

        public async Task UploadImage(UploadingImage img)
        {
            await _ctx.UploadingImages.AddAsync(img);
            await _ctx.SaveChangesAsync();
        }
    }
}