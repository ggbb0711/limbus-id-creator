

using System.Text;
using Newtonsoft.Json;
using RabbitMQ.Client;
using Server.Shared.Config;

namespace Server.Features.Images.Messaging
{
    public class RabbitMQUploadingImagePublisher
    {
        private readonly IConnection _connection;
        private readonly IModel _channel;

        public RabbitMQUploadingImagePublisher(EnvironmentVariables env)
        {
            var factory = new ConnectionFactory() { HostName = env.RabbitMq.Host??"localhost",
                UserName = env.RabbitMq.UserName??"guest",
                Password = env.RabbitMq.Password??"guest",
                VirtualHost = env.RabbitMq.VirtualHost??"/",
                RequestedHeartbeat = TimeSpan.FromSeconds(env.RabbitMq.RequestedHeartbeatSeconds)};
            _connection = factory.CreateConnection();
            _channel = _connection.CreateModel();
            _channel.QueueDeclare(queue: "UploadingImage", durable: false, exclusive: false, autoDelete: false, arguments: null);
        }

        public void PublishUploadImage(UploadingImageRabbitMQQueue body)
        {

            _channel.BasicPublish(
                exchange:"",
                routingKey: "UploadingImage",
                basicProperties: null,
                body: Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(body))
            );
        }

        public void PushFormFileToRabbitMQ(Guid Id, IFormFile image, DateTime lastUpadated)
        {
            using var memoryStream = new MemoryStream();
            image.CopyTo(memoryStream);
            PublishUploadImage(new UploadingImageRabbitMQQueue()
            {
                Id = Id,
                ImageFile = memoryStream.ToArray(),
                lastUpdated = lastUpadated
            });
        }

        public void PushBase64StringToRabbitMQ(Guid Id, string str, DateTime lastUpdated)
        {
            PublishUploadImage(new UploadingImageRabbitMQQueue()
            {
                Id = Id,
                ImageFile = Convert.FromBase64String(str),
                lastUpdated = lastUpdated
            });
        }

        public void PushURLStringToRabbitMQ(Guid Id, string url, DateTime lastUpdated)
        {
            PublishUploadImage(new UploadingImageRabbitMQQueue()
            {
                Id = Id,
                Url = url,
                lastUpdated = lastUpdated,
            });
        }

        public void Dispose()
        {
            _channel.Close();
            _connection.Close();
        }


    }


}
