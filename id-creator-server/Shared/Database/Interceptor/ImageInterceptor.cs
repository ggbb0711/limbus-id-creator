using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Server.Features.Images;
using Server.Features.Images.Enum;
using Server.Shared.Model;

namespace Server.Shared.Database.Interceptor
{
    public class ImageInterceptor() : SaveChangesInterceptor
    {
        public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
        {
            ResolveImageEntityChanges(eventData.Context);
            return base.SavingChanges(eventData, result);
        }
        public override ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData, InterceptionResult<int> result, CancellationToken cancellationToken = default)
        {
            ResolveImageEntityChanges(eventData.Context);
            return base.SavingChangesAsync(eventData, result, cancellationToken);
        }

        private static void ResolveImageEntityChanges(DbContext? ctx)
        {
            if(ctx == null) return;

            var uploadImages = ctx.ChangeTracker.Entries<ImageObj>()
                .Where(e => (e.State == EntityState.Added || e.State == EntityState.Modified)
                    && FileHelper.IsBase64String(e.Entity.Url.Replace("data:image/png;base64,","")));

            var deletedImages = ctx.ChangeTracker.Entries<ImageObj>()
                .Where(e => e.State == EntityState.Deleted && e.Entity.Status != AssetStatus.Deleted);

            foreach(var image in uploadImages)
            {
                image.Entity.Status = AssetStatus.Pending;
            }

            foreach(var deletedImage in deletedImages)
            {
                deletedImage.Entity.Status = AssetStatus.Deleted;
                deletedImage.State = EntityState.Modified;
            }
        }
    }
}
