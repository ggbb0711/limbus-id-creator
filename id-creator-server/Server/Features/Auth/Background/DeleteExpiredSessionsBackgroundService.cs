using Server.Features.Auth.Service;

namespace Server.Features.Auth.Background
{
    public class DeleteExpiredSessionsBackgroundService(IServiceProvider services) : BackgroundService
    {
        private readonly IServiceProvider _services = services;
        private readonly TimeSpan _period = TimeSpan.FromMinutes(30);

        public async Task DoWork()
        {
            using var scope = _services.CreateScope();
            var sessionService = scope.ServiceProvider.GetRequiredService<ISessionService>();
            await sessionService.DeleteExpiredSessions();
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            using PeriodicTimer timer = new(_period);

            while (!stoppingToken.IsCancellationRequested && await timer.WaitForNextTickAsync(stoppingToken))
            {
                try
                {
                    await DoWork();
                }
                catch (Exception)
                {
                }
            }
        }
    }
}
