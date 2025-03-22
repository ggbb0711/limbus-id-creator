using System.Text;
using RabbitMQ.Client;

namespace RepositoryLayer.Utils.RabbitMQPublisher
{
    public class RabbitMQDeletingImagePublisher
    {
        private readonly IConnection _connection;
        private readonly IModel _channel;

        public RabbitMQDeletingImagePublisher()
        {
            var factory = new ConnectionFactory() { HostName = Environment.GetEnvironmentVariable("RABBITMQ_HOST")??"localhost",
                UserName = Environment.GetEnvironmentVariable("RABBITMQ_HOST_USER_NAME")??"guest",
                Password = Environment.GetEnvironmentVariable("RABBITMQ_PASSWORD")??"guest",
                VirtualHost = Environment.GetEnvironmentVariable("RABBITMQ_VH")??"/", 
                RequestedHeartbeat = TimeSpan.FromSeconds(Int32.Parse(Environment.GetEnvironmentVariable("RABBITMQ_REQUESTED_HEARTBEAT")??"150"))};
            _connection = factory.CreateConnection();
            _channel = _connection.CreateModel();
            _channel.QueueDeclare(queue: "DeletingImage", durable: false, exclusive: false, autoDelete: false, arguments: null);
        }

        public void PublishDeleteImage(string publicId)
        {

            _channel.BasicPublish(
                exchange:"",
                routingKey: "DeletingImage",
                basicProperties: null,
                body: Encoding.UTF8.GetBytes(publicId)
            );
        }

        public void Dispose()
        {
            _channel.Close();
            _connection.Close();
        }

        
    }


}