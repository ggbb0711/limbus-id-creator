
using System.Text.Json;
using Server.Features.Images.Enum;
using Server.Features.Images.Service;
using Server.Shared.CloudStorage.Service;

namespace Server.Features.Images.Background
{
    public class UploadImagesBackgroundService(IServiceProvider serviceProvider) : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider = serviceProvider;
        private readonly TimeSpan _period = TimeSpan.FromSeconds( 15 );
        private async Task DoWork()
        {
            using var scope = _serviceProvider.CreateScope();
            var uploadService = scope.ServiceProvider.GetRequiredService<IUploadService>();
            var imageObjService = scope.ServiceProvider.GetRequiredService<IImageObjService>();
            Console.WriteLine("Before running:");
            var images = await imageObjService.GetImagesByStatus(AssetStatus.Pending,500);
            Console.WriteLine("Images upload: " + (images.Count));
            var tasks = new List<Task>();

            foreach ( var image in images ) tasks.Add(((Func<Task>)(async () =>
            {
                if(FileHelper.IsBase64String(image.Url.Replace("data:image/png;base64,","")))
                {
                    var uploadUrl = await uploadService.Upload(Convert.FromBase64String(image.Url.Replace("data:image/png;base64,","")),image.Id.ToString());
                    image.Url = uploadUrl;
                }
                image.Status = AssetStatus.Uploaded;
                await imageObjService.UpdateImage(image);
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
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
            }
        }
    }
}
