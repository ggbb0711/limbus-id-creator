
using Server.Interface.ServiceInterface.ImageObjService;
using Server.Interface.ServiceInterface.StaticStorageService;
using Server.Util.Enums;

namespace Server.Services.UtilServices.Background
{
    public class DeleteImagesBackgroundService(IServiceProvider serviceProvider) : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider = serviceProvider;
        private readonly TimeSpan _period = TimeSpan.FromSeconds( 30 );
        private async Task DoWork()
        {
            using var scope = _serviceProvider.CreateScope();
            
            var deleteService = scope.ServiceProvider.GetRequiredService<IDeleteService>();
            var imageObjService = scope.ServiceProvider.GetRequiredService<IImageObjService>();
            var images = await imageObjService.GetImagesByStatus(AssetStatus.Deleted);
            var tasks = new List<Task>();

            foreach ( var image in images ) tasks.Add(((Func<Task>)(async () =>
            {
                await deleteService.Delete(image.Id.ToString());
                await imageObjService.DeleteImage(image.Id);
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
                catch (Exception)
                {
                }
            }
        }
    }
}