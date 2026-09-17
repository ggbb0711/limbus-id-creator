using AutoFixture;
using Server.Features.Images.Enum;
using Server.Features.Images.Repository;
using Server.Shared.Model;
using Server.Tests.Features.SaveInfo;

namespace Server.Tests.Features.Images.Repository
{
    public class ImageObjRepositoryTest
    {
        [Fact]
        public async Task GetAllImagesByStatus_ReturnsOnlyImagesMatchingTheGivenStatus()
        {
            var db = MockDatabase.CreateDbConnection();
            var fixture = new Fixture();

            var uploadedEntry = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");
            SetAllImageStatuses(uploadedEntry, AssetStatus.Uploaded);
            var pendingEntry = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");
            SetAllImageStatuses(pendingEntry, AssetStatus.Pending);
            var deletedEntry = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");
            SetAllImageStatuses(deletedEntry, AssetStatus.Deleted);

            db.SavedIDInfos.AddRange(uploadedEntry, pendingEntry, deletedEntry);
            await db.SaveChangesAsync();
            db.ChangeTracker.Clear();

            var repository = new ImageObjRepository(db);
            var result = await repository.GetAllImagesByStatus(AssetStatus.Uploaded);

            var expectedIds = new[] { uploadedEntry.ImageAttach.Id, uploadedEntry.Saved.SplashArt.Id, uploadedEntry.Saved.SinnerIcon.Id };
            Assert.Equal(expectedIds.Length, result.Count);
            Assert.All(result, image => Assert.Contains(image.Id, expectedIds));
        }

        private static void SetAllImageStatuses(SavedIDInfo entry, AssetStatus status)
        {
            entry.ImageAttach.Status = status;
            entry.Saved.SplashArt.Status = status;
            entry.Saved.SinnerIcon.Status = status;
        }
    }
}
