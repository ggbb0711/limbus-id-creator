using Server.Features.Auth.Repository;
using Server.Shared.Model;
using Server.Tests.Features.SaveInfo;

namespace Server.Tests.Features.Auth.Repository
{
    public class SessionRepositoryTest
    {
        [Fact]
        public async Task DeleteExpiredSessions_RemovesAndReturnsOnlyExpiredSessions()
        {
            var db = MockDatabase.CreateDbConnection();
            var expired1 = new Session { Id = Guid.NewGuid(), UserId = Guid.NewGuid(), Created = DateTime.Now.AddDays(-10), Expired = DateTime.Now.AddDays(-1) };
            var expired2 = new Session { Id = Guid.NewGuid(), UserId = Guid.NewGuid(), Created = DateTime.Now.AddDays(-10), Expired = DateTime.Now.AddMinutes(-1) };
            var active = new Session { Id = Guid.NewGuid(), UserId = Guid.NewGuid(), Created = DateTime.Now, Expired = DateTime.Now.AddDays(7) };

            db.Session.AddRange(expired1, expired2, active);
            await db.SaveChangesAsync();
            db.ChangeTracker.Clear();

            var repository = new SessionRepository(db);
            var result = await repository.DeleteExpiredSessions();

            Assert.Equal(2, result.Count);
            Assert.Contains(result, s => s.Id == expired1.Id);
            Assert.Contains(result, s => s.Id == expired2.Id);

            Assert.Null(await db.Session.FindAsync(expired1.Id));
            Assert.Null(await db.Session.FindAsync(expired2.Id));
            Assert.NotNull(await db.Session.FindAsync(active.Id));
        }
    }
}
