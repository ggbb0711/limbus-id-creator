using Microsoft.Extensions.DependencyInjection;
using Moq;
using Server.Features.Auth.Background;
using Server.Features.Auth.Service;
using Server.Shared.Model;

namespace Server.Tests.Features.Auth.Background
{
    public class DeleteExpiredSessionsBackgroundServiceTest
    {
        [Fact]
        public async Task DoWork_CallsSessionServiceDeleteExpiredSessions()
        {
            var sessionService = new Mock<ISessionService>();
            sessionService.Setup(s => s.DeleteExpiredSessions()).ReturnsAsync(new List<Session>());

            var provider = new ServiceCollection()
                .AddSingleton(sessionService.Object)
                .BuildServiceProvider();

            var service = new DeleteExpiredSessionsBackgroundService(provider);
            await service.DoWork();

            sessionService.Verify(s => s.DeleteExpiredSessions(), Times.Once);
        }
    }
}
