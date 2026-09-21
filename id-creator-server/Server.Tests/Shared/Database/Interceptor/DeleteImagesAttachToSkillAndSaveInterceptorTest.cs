using AutoFixture;
using Microsoft.EntityFrameworkCore;
using Server.Shared.Database;
using Server.Shared.Database.Interceptor;
using Server.Tests.Features.SaveInfo;

namespace Server.Tests.Shared.Database.Interceptor
{
    public class DeleteImagesAttachToSkillAndSaveInterceptorTest
    {
        private static ServerDbContext CreateDbConnection()
        {
            var options = new DbContextOptionsBuilder<ServerDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .AddInterceptors(new DeleteImagesAttachToSkillAndSaveInterceptor())
                .Options;

            return new ServerDbContext(options);
        }

        [Fact]
        public async Task SavingChangesAsync_RemovesAttachedImage_WhenOffenseSkillIsDeleted()
        {
            using var db = CreateDbConnection();
            var fixture = new Fixture();
            var offenseSkill = MockSaveData.CreateOffenseSkills(fixture, 0)[0];
            var entry = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect", offenseSkills: [offenseSkill]);
            var imageId = offenseSkill.ImageAttach.Id;

            db.SavedIDInfos.Add(entry);
            await db.SaveChangesAsync();
            db.ChangeTracker.Clear();

            var reloaded = await db.OffenseSkill.Include(s => s.ImageAttach)
                .FirstOrDefaultAsync(s => s.Id == offenseSkill.Id && s.SavedSkillId == offenseSkill.SavedSkillId);
            Assert.NotNull(reloaded);
            db.OffenseSkill.Remove(reloaded!);
            await db.SaveChangesAsync();

            Assert.Null(await db.OffenseSkill.FindAsync(offenseSkill.Id, offenseSkill.SavedSkillId));
            Assert.Null(await db.ImageObjs.FindAsync(imageId));
        }

        [Fact]
        public async Task SavingChangesAsync_RemovesAttachedImage_WhenDefenseSkillIsDeleted()
        {
            using var db = CreateDbConnection();
            var fixture = new Fixture();
            var defenseSkill = MockSaveData.CreateDefenseSkills(fixture, 0)[0];
            var entry = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect", defenseSkills: [defenseSkill]);
            var imageId = defenseSkill.ImageAttach.Id;

            db.SavedIDInfos.Add(entry);
            await db.SaveChangesAsync();
            db.ChangeTracker.Clear();

            var reloaded = await db.DefenseSkill.Include(s => s.ImageAttach)
                .FirstOrDefaultAsync(s => s.Id == defenseSkill.Id && s.SavedSkillId == defenseSkill.SavedSkillId);
            Assert.NotNull(reloaded);
            db.DefenseSkill.Remove(reloaded!);
            await db.SaveChangesAsync();

            Assert.Null(await db.DefenseSkill.FindAsync(defenseSkill.Id, defenseSkill.SavedSkillId));
            Assert.Null(await db.ImageObjs.FindAsync(imageId));
        }

        [Fact]
        public async Task SavingChangesAsync_RemovesAttachedImage_WhenCustomEffectIsDeleted()
        {
            using var db = CreateDbConnection();
            var fixture = new Fixture();
            var customEffect = MockSaveData.CreateCustomEffects(fixture, 0)[0];
            var entry = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect", customEffects: [customEffect]);
            var imageId = customEffect.ImageAttach.Id;

            db.SavedIDInfos.Add(entry);
            await db.SaveChangesAsync();
            db.ChangeTracker.Clear();

            var reloaded = await db.CustomEffect.Include(s => s.ImageAttach)
                .FirstOrDefaultAsync(s => s.Id == customEffect.Id && s.SavedSkillId == customEffect.SavedSkillId);
            Assert.NotNull(reloaded);
            db.CustomEffect.Remove(reloaded!);
            await db.SaveChangesAsync();

            Assert.Null(await db.CustomEffect.FindAsync(customEffect.Id, customEffect.SavedSkillId));
            Assert.Null(await db.ImageObjs.FindAsync(imageId));
        }

        [Fact]
        public async Task SavingChangesAsync_RemovesAllAssociatedImages_WhenSavedIDInfoIsDeleted()
        {
            using var db = CreateDbConnection();
            var fixture = new Fixture();
            var entry = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");

            db.SavedIDInfos.Add(entry);
            await db.SaveChangesAsync();
            db.ChangeTracker.Clear();

            var thumbnailId = entry.ImageAttach.Id;
            var splashArtId = entry.Saved.SplashArt.Id;
            var sinnerIconId = entry.Saved.SinnerIcon.Id;

            var reloaded = await db.SavedIDInfos
                .Include(e => e.ImageAttach)
                .Include(e => e.Saved).ThenInclude(s => s.SplashArt)
                .Include(e => e.Saved).ThenInclude(s => s.SinnerIcon)
                .FirstOrDefaultAsync(e => e.Id == entry.Id);
            Assert.NotNull(reloaded);
            db.SavedIDInfos.Remove(reloaded!);
            await db.SaveChangesAsync();

            Assert.Null(await db.SavedIDInfos.FindAsync(entry.Id));
            Assert.Null(await db.ImageObjs.FindAsync(thumbnailId));
            Assert.Null(await db.ImageObjs.FindAsync(splashArtId));
            Assert.Null(await db.ImageObjs.FindAsync(sinnerIconId));
        }

        [Fact]
        public async Task SavingChangesAsync_RemovesAllAssociatedImages_WhenSavedEGOInfoIsDeleted()
        {
            using var db = CreateDbConnection();
            var fixture = new Fixture();
            var entry = MockSaveData.CreateSavedEgoEntry(fixture, Guid.NewGuid(), "Effect");

            db.SavedEGOInfos.Add(entry);
            await db.SaveChangesAsync();
            db.ChangeTracker.Clear();

            var thumbnailId = entry.ImageAttach.Id;
            var splashArtId = entry.Saved.SplashArt.Id;
            var sinnerIconId = entry.Saved.SinnerIcon.Id;

            var reloaded = await db.SavedEGOInfos
                .Include(e => e.ImageAttach)
                .Include(e => e.Saved).ThenInclude(s => s.SplashArt)
                .Include(e => e.Saved).ThenInclude(s => s.SinnerIcon)
                .FirstOrDefaultAsync(e => e.Id == entry.Id);
            Assert.NotNull(reloaded);
            db.SavedEGOInfos.Remove(reloaded!);
            await db.SaveChangesAsync();

            Assert.Null(await db.SavedEGOInfos.FindAsync(entry.Id));
            Assert.Null(await db.ImageObjs.FindAsync(thumbnailId));
            Assert.Null(await db.ImageObjs.FindAsync(splashArtId));
            Assert.Null(await db.ImageObjs.FindAsync(sinnerIconId));
        }
    }
}
