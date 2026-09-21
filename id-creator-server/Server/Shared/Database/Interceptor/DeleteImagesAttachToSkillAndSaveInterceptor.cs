using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Server.Shared.Model;

namespace Server.Shared.Database.Interceptor
{
    public class DeleteImagesAttachToSkillAndSaveInterceptor() : SaveChangesInterceptor
    {
        public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
        {
            DeleteImagesAttachToSkillAndSave(eventData.Context);
            return base.SavingChanges(eventData, result);
        }
        public override ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData, InterceptionResult<int> result, CancellationToken cancellationToken = default)
        {
            DeleteImagesAttachToSkillAndSave(eventData.Context);
            return base.SavingChangesAsync(eventData, result, cancellationToken);
        }

        private static void DeleteImagesAttachToSkillAndSave(DbContext? ctx)
        {
            if(ctx == null) return;

            var baseLineSavedIdImages = ctx.ChangeTracker.Entries<SavedIDInfo>()
                .Where(e => e.State == EntityState.Deleted)
                .SelectMany(e => new[]
                {
                    e.Entity.ImageAttach,
                    e.Entity.Saved.SplashArt,
                    e.Entity.Saved.SinnerIcon
                })
                .ToList();
            
            var baseLineSavedEGOImages = ctx.ChangeTracker.Entries<SavedEGOInfo>()
                .Where(e => e.State == EntityState.Deleted)
                .SelectMany(e => new[]
                {
                    e.Entity.ImageAttach,
                    e.Entity.Saved.SplashArt,
                    e.Entity.Saved.SinnerIcon
                })
                .ToList();
            

            var deletedOffenseSkills = ctx.ChangeTracker.Entries<OffenseSkill>()
                .Where(e => e.State == EntityState.Deleted && e.Entity.ImageAttach != null)
                .Select(e => e.Entity.ImageAttach);

            var deletedDefenseSkills = ctx.ChangeTracker.Entries<DefenseSkill>()
                .Where(e => e.State == EntityState.Deleted && e.Entity.ImageAttach != null)
                .Select(e => e.Entity.ImageAttach);

            var deletedCustomEffects = ctx.ChangeTracker.Entries<CustomEffect>()
                .Where(e => e.State == EntityState.Deleted && e.Entity.ImageAttach != null)
                .Select(e => e.Entity.ImageAttach);

            var deletedImages = new List<ImageObj>();

            foreach(var imageAttach in (List<ImageObj>)
                [..baseLineSavedIdImages,
                ..baseLineSavedEGOImages,
                .. deletedOffenseSkills,
                .. deletedDefenseSkills,
                .. deletedCustomEffects])
                deletedImages.Add(imageAttach);
            ctx.RemoveRange(deletedImages);
        }
    }
}
