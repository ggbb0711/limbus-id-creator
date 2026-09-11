

using System.Text;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using Server.Shared.CloudStorage.Service;
using Server.Shared.Config;

namespace Server.Features.Images.Messaging
{
    public class RabbitMQDeletingImageConsumerService : BackgroundService
    {
        private readonly IConnection _connection;
        private readonly IModel _channel;
        private readonly IServiceProvider _services;

        public RabbitMQDeletingImageConsumerService(IServiceProvider services, EnvironmentVariables env)
        {
            var factory = new ConnectionFactory() { HostName = env.RabbitMq.Host??"localhost",
                UserName = env.RabbitMq.UserName??"guest",
                Password = env.RabbitMq.Password??"guest",
                VirtualHost = env.RabbitMq.VirtualHost??"/",
                RequestedHeartbeat = TimeSpan.FromSeconds(env.RabbitMq.RequestedHeartbeatSeconds)};
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
                        var deleteService = scope.ServiceProvider.GetRequiredService<IDeleteService>();
                        await deleteService.Delete(publicId);
                    }
                }
                catch (System.Exception ex)
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
