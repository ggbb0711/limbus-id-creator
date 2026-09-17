using AutoFixture;
using Microsoft.EntityFrameworkCore;
using Server.Shared.Database;
using Server.Shared.Database.Interceptor;
using Server.Tests.Features.SaveInfo;

namespace Server.Tests.Shared.Database.Interceptor
{
    public class DeleteImagesAttachToSkillInterceptorTest
    {
        private static ServerDbContext CreateDbConnection()
        {
            var options = new DbContextOptionsBuilder<ServerDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .AddInterceptors(new DeleteImagesAttachToSkillInterceptor())
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
    }
}
