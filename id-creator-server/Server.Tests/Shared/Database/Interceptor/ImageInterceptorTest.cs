using AutoFixture;
using Microsoft.EntityFrameworkCore;
using Server.Features.Images.Enum;
using Server.Shared.Database;
using Server.Shared.Database.Interceptor;
using Server.Tests.Features.SaveInfo;

namespace Server.Tests.Shared.Database.Interceptor
{
    public class ImageInterceptorTest
    {
        private static ServerDbContext CreateDbConnection()
        {
            var options = new DbContextOptionsBuilder<ServerDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .AddInterceptors(new ImageInterceptor())
                .Options;

            return new ServerDbContext(options);
        }

        [Fact]
        public async Task SavingChangesAsync_SetsStatusToPending_WhenAddedImageUrlIsBase64()
        {
            using var db = CreateDbConnection();
            var fixture = new Fixture();
            var entry = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");
            entry.ImageAttach.Url = "data:image/png;base64," + Convert.ToBase64String("x"u8.ToArray());

            db.SavedIDInfos.Add(entry);
            await db.SaveChangesAsync();

            Assert.Equal(AssetStatus.Pending, entry.ImageAttach.Status);
        }

        [Fact]
        public async Task SavingChangesAsync_LeavesStatusUnchanged_WhenAddedImageUrlIsNotBase64()
        {
            using var db = CreateDbConnection();
            var fixture = new Fixture();
            var entry = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");
            entry.ImageAttach.Url = "https://example.com/image.png";
            entry.ImageAttach.Status = AssetStatus.Uploaded;

            db.SavedIDInfos.Add(entry);
            await db.SaveChangesAsync();

            Assert.Equal(AssetStatus.Uploaded, entry.ImageAttach.Status);
        }

        [Fact]
        public async Task SavingChangesAsync_SoftDeletesImage_WhenImageEntryIsDeleted()
        {
            using var db = CreateDbConnection();
            var fixture = new Fixture();
            var entry = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");
            entry.ImageAttach.Status = AssetStatus.Uploaded;
            db.SavedIDInfos.Add(entry);
            await db.SaveChangesAsync();
            db.ChangeTracker.Clear();

            var reloaded = await db.SavedIDInfos.Include(s => s.ImageAttach).FirstOrDefaultAsync(s => s.Id == entry.Id);
            Assert.NotNull(reloaded);
            var imageId = reloaded!.ImageAttach.Id;
            db.Entry(reloaded.ImageAttach).State = EntityState.Deleted;
            await db.SaveChangesAsync();

            var stillExists = await db.ImageObjs.FindAsync(imageId);
            Assert.NotNull(stillExists);
            Assert.Equal(AssetStatus.Deleted, stillExists!.Status);
        }
    }
}
