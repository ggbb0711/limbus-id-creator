


using Server.Interface.ServiceInterface.SessionInterface;

namespace Server.Services.UtilServices
{
    public class BackgroundHostedService(IServiceProvider services, ILogger logger) : BackgroundService
    {
        private readonly IServiceProvider _services = services;
        private readonly TimeSpan _period = TimeSpan.FromMinutes(30);
        private readonly ILogger _logger = logger;

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
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while executing 30-minute job.");
                }
            }
        }
    }
}