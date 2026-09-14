
using Server.Features.Images.Enum;
using Server.Features.Images.Service;
using Server.Shared.CloudStorage.Service;

namespace Server.Features.Images.Background
{
    public class UploadImagesBackgroundService(IServiceProvider serviceProvider) : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider = serviceProvider;
        private readonly TimeSpan _period = TimeSpan.FromSeconds( 30 );
        private async Task DoWork()
        {
            using var scope = _serviceProvider.CreateScope();

            var uploadService = scope.ServiceProvider.GetRequiredService<IUploadService>();
            var imageObjService = scope.ServiceProvider.GetRequiredService<IImageObjService>();
            var images = await imageObjService.GetImagesByStatus(AssetStatus.Pending);
            var tasks = new List<Task>();

            foreach ( var image in images ) tasks.Add(((Func<Task>)(async () =>
            {
                if(FileHelper.IsBase64String(image.Url.Replace("data:image/png;base64,","")))
                {
                    var uploadUrl = await uploadService.Upload(Convert.FromBase64String(image.Url.Replace("data:image/png;base64,","")),image.Id.ToString());
                    await imageObjService.UpdateImage(image.Id, uploadUrl, image.LastUpdated);
                }
            }))());
            await Task.WhenAll(tasks);
        }
        protected async override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            using PeriodicTimer timer = new(_period);

            while (!stoppingToken.IsCancellationRequested && await timer.WaitForNextTickAsync(stoppingToken))
            {
                try
                {
                    await DoWork();
                }
                catch (System.Exception)
                {
                }
            }
        }
    }
}
