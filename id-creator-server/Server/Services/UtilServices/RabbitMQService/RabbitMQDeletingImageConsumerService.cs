

using System.Text;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using Server.Interface.ServiceInterface.StaticStorageService;

namespace Server.Services.UtilServices
{
    public class RabbitMQDeletingImageConsumerService : BackgroundService
    {
        private readonly IConnection _connection;
        private readonly IModel _channel;
        private readonly IServiceProvider _services;

        public RabbitMQDeletingImageConsumerService(IServiceProvider services)
        {
            var factory = new ConnectionFactory() { HostName = Environment.GetEnvironmentVariable("RABBITMQ_HOST")??"localhost" };
            _connection = factory.CreateConnection();
            _channel = _connection.CreateModel();
            _channel.QueueDeclare(queue: "DeletingImage", durable: false, exclusive: false, autoDelete: false, arguments: null);
            _services = services;
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var consumer = new EventingBasicConsumer(_channel);
            consumer.Received += async (model, ea) =>
            {
                var body = ea.Body.ToArray();
                var publicId = Encoding.UTF8.GetString(body);
                
                try
                {
                    using(var scope = _services.CreateScope())
                    {
                        var cloudinaryService = scope.ServiceProvider.GetRequiredService<IDeleteService>();
                        await cloudinaryService.Delete(publicId);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                }
            };

            _channel.BasicConsume(queue: "DeletingImage", autoAck: true, consumer: consumer);
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