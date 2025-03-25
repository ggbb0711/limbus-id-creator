using System.Text;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using RepositoryLayer.Utils.RabbitMQPublisher;
using ServiceLayer.Interfaces.ImageObjService;
using ServiceLayer.Interfaces.StaticStorageService;

namespace ServiceLayer.Services.UtilServices.RabbitMQService
{
    public class RabbitMQUploadingImageConsumerService : BackgroundService
    {
        private readonly IConnection _connection;
        private readonly IModel _channel;
        private readonly IServiceProvider _services;

        public RabbitMQUploadingImageConsumerService(IServiceProvider services)
        {
            var factory = new ConnectionFactory() { HostName = Environment.GetEnvironmentVariable("RABBITMQ_HOST")??"localhost",
                UserName = Environment.GetEnvironmentVariable("RABBITMQ_HOST_USER_NAME")??"guest",
                Password = Environment.GetEnvironmentVariable("RABBITMQ_PASSWORD")??"guest",
                VirtualHost = Environment.GetEnvironmentVariable("RABBITMQ_VH")??"/",
                RequestedHeartbeat = TimeSpan.FromSeconds(Int32.Parse(Environment.GetEnvironmentVariable("RABBITMQ_REQUESTED_HEARTBEAT")??"150"))};
            _connection = factory.CreateConnection();
            _channel = _connection.CreateModel();
            _channel.QueueDeclare(queue: "UploadingImage", durable: false, exclusive: false, autoDelete: false, arguments: null);
            _services = services;
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var consumer = new EventingBasicConsumer(_channel);
            consumer.Received += async (model, ea) =>
            {
                var body = ea.Body.ToArray();
                var stringifyBody = Encoding.UTF8.GetString(body);
                var uploadingImage = JsonConvert.DeserializeObject<UploadingImageRabbitMQQueue>(stringifyBody);
                
                if(uploadingImage != null)
                {
                    try
                    {
                        using(var scope = _services.CreateScope())
                        {
                            var cloudinaryService = scope.ServiceProvider.GetRequiredService<IUploadService>();
                            var uploadUrl =(uploadingImage.ImageFile!=null)? await cloudinaryService.Upload(uploadingImage.ImageFile,uploadingImage.Id.ToString())
                            :await cloudinaryService.Upload(uploadingImage.Url,uploadingImage.Id.ToString());
                            var imageObjService = scope.ServiceProvider.GetRequiredService<IImageObjService>();
                            await imageObjService.UpdateImage(uploadingImage.Id,uploadUrl,uploadingImage.lastUpdated);
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex);
                    }
                    
                }
            };

            _channel.BasicConsume(queue: "UploadingImage", autoAck: true, consumer: consumer);
            return Task.CompletedTask;
        }

        public override void Dispose()
        {
            _channel.Close();
            _connection.Close();
            base.Dispose();
        }
    }
}