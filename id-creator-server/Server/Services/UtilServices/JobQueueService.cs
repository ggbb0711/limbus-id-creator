using System.Collections.Concurrent;

namespace Server.Services.UtilServices
{
    public class JobQueue
{
    private readonly ConcurrentQueue<Func<Task>> _workItems = new ConcurrentQueue<Func<Task>>();
    private readonly SemaphoreSlim _signal = new SemaphoreSlim(0);

    public void Enqueue(Func<Task> workItem)
    {
        if (workItem == null)
        {
            throw new ArgumentNullException(nameof(workItem));
        }

        _workItems.Enqueue(workItem);
        _signal.Release();
    }

    public async Task<Func<Task>> DequeueAsync(CancellationToken cancellationToken)
    {
        await _signal.WaitAsync(cancellationToken);
        _workItems.TryDequeue(out var workItem);

        return workItem;
    }
}
}