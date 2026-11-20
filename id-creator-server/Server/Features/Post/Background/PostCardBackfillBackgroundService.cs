using Server.Features.Post.Service;
using Server.Shared.Config;

namespace Server.Features.Post.Background
{
    public class PostCardBackfillBackgroundService(IServiceProvider serviceProvider, EnvironmentVariables env, ILogger<PostCardBackfillBackgroundService> logger) : BackgroundService
    {
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            if (!env.BackfillPostCards) return;
            using var scope = serviceProvider.CreateScope();
            var backfill = scope.ServiceProvider.GetRequiredService<PostCardBackfill>();
            var report = await backfill.RunAsync(env.BackfillDryRun);
            logger.LogInformation(
                "Post card backfill ({Mode}): {Scanned} posts scanned, {Full} fully matched, {Partly} partly matched, {Unmatched} unmatched, {Pending} images skipped while uploading, {Created} cards created",
                env.BackfillDryRun ? "dry run" : "write",
                report.PostsScanned, report.FullyMatched, report.PartlyMatched, report.Unmatched, report.PendingSkipped, report.CardsCreated);
        }
    }
}
