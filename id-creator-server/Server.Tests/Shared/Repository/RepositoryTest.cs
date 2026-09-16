using AutoFixture;
using Server.Shared.Http;
using Server.Shared.Model;
using Server.Shared.Repository;
using Server.Tests.Features.SaveInfo;

namespace Server.Tests.Shared.Repository
{
    public class RepositoryTest
    {
        [Fact]
        public async Task AddAsync_PersistsEntity_AfterSaveChangeAsync()
        {
            var db = MockDatabase.CreateDbConnection();
            var fixture = new Fixture();
            var repo = new Repository<SavedIDInfo>(db);
            var entry = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");

            var result = await repo.AddAsync(entry);
            await repo.SaveChangeAsync();
            db.ChangeTracker.Clear();

            Assert.Same(entry, result);
            var persisted = await repo.GetByIdAsync(entry.Id);
            Assert.NotNull(persisted);
            Assert.Equal(entry.Name, persisted!.Name);
        }

        [Fact]
        public async Task AddBulkAsync_PersistsAllEntities_AfterSaveChangeAsync()
        {
            var db = MockDatabase.CreateDbConnection();
            var fixture = new Fixture();
            var repo = new Repository<SavedIDInfo>(db);
            var entry1 = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "A");
            var entry2 = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "B");

            await repo.AddBulkAsync([entry1, entry2]);
            await repo.SaveChangeAsync();
            db.ChangeTracker.Clear();

            Assert.NotNull(await repo.GetByIdAsync(entry1.Id));
            Assert.NotNull(await repo.GetByIdAsync(entry2.Id));
        }

        [Fact]
        public async Task GetByIdAsync_ReturnsEntity_WhenFound()
        {
            var db = MockDatabase.CreateDbConnection();
            var fixture = new Fixture();
            var repo = new Repository<SavedIDInfo>(db);
            var entry = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");
            db.SavedIDInfos.Add(entry);
            await db.SaveChangesAsync();
            db.ChangeTracker.Clear();

            var result = await repo.GetByIdAsync(entry.Id);

            Assert.NotNull(result);
            Assert.Equal(entry.Id, result!.Id);
        }

        [Fact]
        public async Task GetByIdAsync_ReturnsNull_WhenNotFound()
        {
            var db = MockDatabase.CreateDbConnection();
            var repo = new Repository<SavedIDInfo>(db);

            var result = await repo.GetByIdAsync(Guid.NewGuid());

            Assert.Null(result);
        }

        [Fact]
        public async Task UpdateAsync_PersistsChanges_AfterSaveChangeAsync()
        {
            var db = MockDatabase.CreateDbConnection();
            var fixture = new Fixture();
            var repo = new Repository<SavedIDInfo>(db);
            var entry = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");
            db.SavedIDInfos.Add(entry);
            await db.SaveChangesAsync();
            db.ChangeTracker.Clear();

            var detached = await repo.GetByIdAsync(entry.Id);
            Assert.NotNull(detached);
            db.ChangeTracker.Clear();
            detached!.Name = "Updated Name";

            await repo.UpdateAsync(detached);
            await repo.SaveChangeAsync();
            db.ChangeTracker.Clear();

            var persisted = await repo.GetByIdAsync(entry.Id);
            Assert.Equal("Updated Name", persisted!.Name);
        }

        [Fact]
        public async Task UpdateBulkAsync_PersistsChanges_ForAllEntities()
        {
            var db = MockDatabase.CreateDbConnection();
            var fixture = new Fixture();
            var repo = new Repository<SavedIDInfo>(db);
            var entry1 = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "A");
            var entry2 = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "B");
            db.SavedIDInfos.AddRange(entry1, entry2);
            await db.SaveChangesAsync();
            db.ChangeTracker.Clear();

            var detached1 = await repo.GetByIdAsync(entry1.Id);
            var detached2 = await repo.GetByIdAsync(entry2.Id);
            Assert.NotNull(detached1);
            Assert.NotNull(detached2);
            db.ChangeTracker.Clear();
            detached1!.Name = "Updated A";
            detached2!.Name = "Updated B";

            await repo.UpdateBulkAsync([detached1, detached2]);
            await repo.SaveChangeAsync();
            db.ChangeTracker.Clear();

            var persisted1 = await repo.GetByIdAsync(entry1.Id);
            var persisted2 = await repo.GetByIdAsync(entry2.Id);
            Assert.Equal("Updated A", persisted1!.Name);
            Assert.Equal("Updated B", persisted2!.Name);
        }

        [Fact]
        public async Task RemoveAsync_DeletesEntity_AfterSaveChangeAsync()
        {
            var db = MockDatabase.CreateDbConnection();
            var fixture = new Fixture();
            var repo = new Repository<SavedIDInfo>(db);
            var entry = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");
            db.SavedIDInfos.Add(entry);
            await db.SaveChangesAsync();
            db.ChangeTracker.Clear();

            var tracked = await repo.GetByIdAsync(entry.Id);
            Assert.NotNull(tracked);

            await repo.RemoveAsync(tracked!);
            await repo.SaveChangeAsync();
            db.ChangeTracker.Clear();

            Assert.Null(await repo.GetByIdAsync(entry.Id));
        }

        [Fact]
        public async Task FindAsync_WithNoFilter_ReturnsAllEntities_IgnoringSkipAndTake()
        {
            var db = MockDatabase.CreateDbConnection();
            var fixture = new Fixture();
            var repo = new Repository<SavedIDInfo>(db);
            var entry1 = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "A");
            var entry2 = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "B");
            var entry3 = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "C");
            db.SavedIDInfos.AddRange(entry1, entry2, entry3);
            await db.SaveChangesAsync();
            db.ChangeTracker.Clear();

            var result = await repo.FindAsync(new RepositoryGetParams<SavedIDInfo> { Skip = 0, Take = 1 });

            Assert.Equal(3, result.Count());
        }

        [Fact]
        public async Task FindAsync_WithFilter_AppliesWhereSkipAndTake()
        {
            var db = MockDatabase.CreateDbConnection();
            var fixture = new Fixture();
            var repo = new Repository<SavedIDInfo>(db);
            var userId = Guid.NewGuid();
            var matching1 = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "A");
            matching1.UserId = userId;
            var matching2 = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "B");
            matching2.UserId = userId;
            var matching3 = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "C");
            matching3.UserId = userId;
            var nonMatching = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "D");
            db.SavedIDInfos.AddRange(matching1, matching2, matching3, nonMatching);
            await db.SaveChangesAsync();
            db.ChangeTracker.Clear();

            var result = await repo.FindAsync(new RepositoryGetParams<SavedIDInfo>
            {
                Filter = s => s.UserId == userId,
                Skip = 1,
                Take = 1,
            });

            Assert.Single(result);
        }

        [Fact]
        public async Task FindAsync_AppliesOrderByAfterSkipAndTake_NotBeforeIt()
        {
            var db = MockDatabase.CreateDbConnection();
            var fixture = new Fixture();
            var repo = new Repository<SavedIDInfo>(db);

            var first = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");
            first.Name = "First";
            first.SaveTime = new DateTime(2020, 1, 1);
            var second = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");
            second.Name = "Second";
            second.SaveTime = new DateTime(2024, 1, 1);
            var third = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");
            third.Name = "Third";
            third.SaveTime = new DateTime(2022, 1, 1);
            db.SavedIDInfos.AddRange(first, second, third);
            await db.SaveChangesAsync();
            db.ChangeTracker.Clear();

            var result = await repo.FindAsync(new RepositoryGetParams<SavedIDInfo>
            {
                Filter = _ => true,
                Skip = 0,
                Take = 2,
                OrderBy = q => q.OrderByDescending(s => s.SaveTime),
            });

            var names = result.Select(s => s.Name).ToList();

            Assert.Equal(2, names.Count);
            Assert.Contains("First", names);
            Assert.Contains("Second", names);
            Assert.DoesNotContain("Third", names);
        }

        [Fact]
        public async Task FindAsync_WithoutIncludeProperties_LeavesSavedNavigationNull()
        {
            var db = MockDatabase.CreateDbConnection();
            var fixture = new Fixture();
            var repo = new Repository<SavedIDInfo>(db);
            var entry = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");
            db.SavedIDInfos.Add(entry);
            await db.SaveChangesAsync();
            db.ChangeTracker.Clear();

            var result = await repo.FindAsync(new RepositoryGetParams<SavedIDInfo> { Filter = s => s.Id == entry.Id });

            var found = Assert.Single(result);
            Assert.Null(found.Saved);
        }

        [Fact]
        public async Task FindAsync_WithIncludeProperties_PopulatesSavedNavigation()
        {
            var db = MockDatabase.CreateDbConnection();
            var fixture = new Fixture();
            var repo = new Repository<SavedIDInfo>(db);
            var entry = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");
            db.SavedIDInfos.Add(entry);
            await db.SaveChangesAsync();
            db.ChangeTracker.Clear();

            var result = await repo.FindAsync(new RepositoryGetParams<SavedIDInfo>
            {
                Filter = s => s.Id == entry.Id,
                IncludeProperties = "Saved",
            });

            var found = Assert.Single(result);
            Assert.NotNull(found.Saved);
            Assert.Equal(entry.Saved.Title, found.Saved.Title);
        }
    }
}
