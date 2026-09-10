using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Server.Interface.UtilInterfaces;
using Server.Models;
using Server.Util.Enums;

namespace Server.Util.Interceptors
{
    public class DeleteImagesAttachToSkillInterceptor() : SaveChangesInterceptor
    {
        public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
        {
            DeleteImagesAttachToSkill(eventData.Context);
            return base.SavingChanges(eventData, result);
        }
        public override ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData, InterceptionResult<int> result, CancellationToken cancellationToken = default)
        {
            DeleteImagesAttachToSkill(eventData.Context);
            return base.SavingChangesAsync(eventData, result, cancellationToken);
        }

        private static void DeleteImagesAttachToSkill(DbContext? ctx)
        {
            if(ctx == null) return;

            var deletedOffenseSkills = (List<IImageAttach>)ctx.ChangeTracker.Entries<OffenseSkill>()
                .Where(e => (e.State == EntityState.Deleted))
                .Select(e => e.Entity);
            
            var deletedDefenseSkills = (List<IImageAttach>)ctx.ChangeTracker.Entries<DefenseSkill>()
                .Where(e => (e.State == EntityState.Deleted))
                .Select(e => e.Entity);

            var deletedCustomEffects = (List<IImageAttach>)ctx.ChangeTracker.Entries<CustomEffect>()
                .Where(e => (e.State == EntityState.Deleted))
                .Select(e => e.Entity);
            
            var deletedImages = new List<ImageObj>();
            
            foreach(var imageAttachedEntity in (List<IImageAttach>)
                [.. deletedOffenseSkills, 
                .. deletedDefenseSkills, 
                .. deletedCustomEffects])
                deletedImages.Add(imageAttachedEntity.ImageAttach);
            ctx.RemoveRange(deletedImages);
        }
    }
}