


using Server.Interface.ServiceInterface.SessionInterface;

namespace Server.Services.UtilServices
{
    public class BackgroundHostedService: IHostedService, IDisposable
    {
        private readonly IServiceProvider _services;
        private Timer _timer;

        public BackgroundHostedService(IServiceProvider services)
        {
            _services = services;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _timer = new Timer(
                async state=> await DoWork(),
                null,
                TimeSpan.Zero,
                TimeSpan.FromMinutes(30)
            );

            return Task.CompletedTask;
        }

        public async Task DoWork()
        {
            using(var scope = _services.CreateScope())
            {
                var sessionService = scope.ServiceProvider.GetRequiredService<ISessionService>();
                await sessionService.DeleteExpiredSessions();
            }
        }
    
        public Task StopAsync(CancellationToken cancellationToken)
        {
            _timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }
    }
}