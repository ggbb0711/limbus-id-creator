using System.Text;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using RabbitMQ.Client;
using IModel = RabbitMQ.Client.IModel;

namespace RepositoryLayer.Utils.RabbitMQPublisher
{
    public class RabbitMQUploadingImagePublisher
    {
        private readonly IConnection _connection;
        private readonly IModel _channel;

        public RabbitMQUploadingImagePublisher()
        {
            var factory = new ConnectionFactory() { HostName = Environment.GetEnvironmentVariable("RABBITMQ_HOST")??"localhost",
                UserName = Environment.GetEnvironmentVariable("RABBITMQ_HOST_USER_NAME")??"guest",
                Password = Environment.GetEnvironmentVariable("RABBITMQ_PASSWORD")??"guest",
                VirtualHost = Environment.GetEnvironmentVariable("RABBITMQ_VH")??"/",
                RequestedHeartbeat = TimeSpan.FromSeconds(Int32.Parse(Environment.GetEnvironmentVariable("RABBITMQ_REQUESTED_HEARTBEAT")??"150"))};
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