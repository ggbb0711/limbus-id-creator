using Moq;
using Server.Features.Auth.Repository;
using Server.Features.Auth.Service;
using Server.Shared.Http;
using Server.Shared.Model;

namespace Server.Tests.Features.Auth.Service
{
    public class SessionServiceTest
    {
        [Fact]
        public async Task GetSessionById_ReturnsRepositoryResult()
        {
            var session = new Session { Id = Guid.NewGuid() };
            var repository = new Mock<ISessionRepository>();
            repository.Setup(r => r.GetByIdAsync(session.Id)).ReturnsAsync(session);

            var service = new SessionService(repository.Object, EnvironmentVariablesTestHelper.Create());
            var result = await service.GetSessionById(session.Id);

            Assert.Same(session, result);
        }

        [Fact]
        public async Task AddSession_PersistsAndReturnsSession_WithExpiryBasedOnEnvironment()
        {
            var userId = Guid.NewGuid();
            var env = EnvironmentVariablesTestHelper.Create(sessionExpiredDay: 7);
            var repository = new Mock<ISessionRepository>();
            repository.Setup(r => r.AddAsync(It.IsAny<Session>())).ReturnsAsync((Session s) => s);
            repository.Setup(r => r.SaveChangeAsync()).Returns(Task.CompletedTask);

            var service = new SessionService(repository.Object, env);
            var before = DateTime.Now;
            var result = await service.AddSession(userId);
            var after = DateTime.Now;

            Assert.NotEqual(Guid.Empty, result.Id);
            Assert.Equal(userId, result.UserId);
            Assert.InRange(result.Expired, before.AddDays(7).AddSeconds(-5), after.AddDays(7).AddSeconds(5));
            repository.Verify(r => r.AddAsync(It.IsAny<Session>()), Times.Once);
            repository.Verify(r => r.SaveChangeAsync(), Times.Once);
        }

        [Fact]
        public async Task DeleteSessionById_RemovesAndReturnsSession_WhenFound()
        {
            var session = new Session { Id = Guid.NewGuid() };
            var repository = new Mock<ISessionRepository>();
            repository.Setup(r => r.GetByIdAsync(session.Id)).ReturnsAsync(session);
            repository.Setup(r => r.RemoveAsync(session)).Returns(Task.CompletedTask);

            var service = new SessionService(repository.Object, EnvironmentVariablesTestHelper.Create());
            var result = await service.DeleteSessionById(session.Id);

            Assert.Same(session, result);
            repository.Verify(r => r.RemoveAsync(session), Times.Once);
            repository.Verify(r => r.SaveChangeAsync(), Times.Never);
        }

        [Fact]
        public async Task DeleteSessionById_ReturnsNull_WhenNotFound()
        {
            var id = Guid.NewGuid();
            var repository = new Mock<ISessionRepository>();
            repository.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((Session?)null);

            var service = new SessionService(repository.Object, EnvironmentVariablesTestHelper.Create());
            var result = await service.DeleteSessionById(id);

            Assert.Null(result);
            repository.Verify(r => r.RemoveAsync(It.IsAny<Session>()), Times.Never);
        }

        [Fact]
        public async Task DeleteSessionByUserId_RemovesAndReturnsSession_WhenFound()
        {
            var userId = Guid.NewGuid();
            var session = new Session { Id = Guid.NewGuid(), UserId = userId };
            var repository = new Mock<ISessionRepository>();
            repository
                .Setup(r => r.FindAsync(It.IsAny<RepositoryGetParams<Session>>()))
                .ReturnsAsync((RepositoryGetParams<Session> p) =>
                    new List<Session> { session }.AsQueryable().Where(p.Filter!).AsEnumerable());
            repository.Setup(r => r.RemoveAsync(session)).Returns(Task.CompletedTask);

            var service = new SessionService(repository.Object, EnvironmentVariablesTestHelper.Create());
            var result = await service.DeleteSessionByUserId(userId);

            Assert.Same(session, result);
            repository.Verify(r => r.RemoveAsync(session), Times.Once);
        }

        [Fact]
        public async Task DeleteSessionByUserId_Throws_WhenNoSessionMatches()
        {
            var repository = new Mock<ISessionRepository>();
            repository
                .Setup(r => r.FindAsync(It.IsAny<RepositoryGetParams<Session>>()))
                .ReturnsAsync(Enumerable.Empty<Session>());

            var service = new SessionService(repository.Object, EnvironmentVariablesTestHelper.Create());

            await Assert.ThrowsAsync<InvalidOperationException>(() => service.DeleteSessionByUserId(Guid.NewGuid()));
        }

        [Fact]
        public async Task DeleteExpiredSessions_ReturnsRepositoryResult()
        {
            var expired = new List<Session> { new() { Id = Guid.NewGuid() } };
            var repository = new Mock<ISessionRepository>();
            repository.Setup(r => r.DeleteExpiredSessions()).ReturnsAsync(expired);

            var service = new SessionService(repository.Object, EnvironmentVariablesTestHelper.Create());
            var result = await service.DeleteExpiredSessions();

            Assert.Same(expired, result);
        }
    }
}
