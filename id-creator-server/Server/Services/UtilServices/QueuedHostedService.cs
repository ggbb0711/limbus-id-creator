using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;



namespace Server.Services.UtilServices
{
    public class QueuedHostedService : BackgroundService
{
    private readonly ILogger<QueuedHostedService> _logger;
    private readonly JobQueue _jobQueue;

    public QueuedHostedService(JobQueue jobQueue, ILogger<QueuedHostedService> logger)
    {
        _jobQueue = jobQueue;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Queued Hosted Service is running.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var workItem = await _jobQueue.DequeueAsync(stoppingToken);
                
                try
                {
                    await workItem();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred executing {WorkItem}.", nameof(workItem));
                    _jobQueue.Enqueue(workItem);
                }
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "Error occurred while trying to dequeue a job.");
            }
        }
    }
}
}