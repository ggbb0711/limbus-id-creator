using System.Text;
using RabbitMQ.Client;

namespace Server.Util.RabbitMQPublisher
{
    public class RabbitMQDeletingImagePublisher
    {
        private readonly IConnection _connection;
        private readonly IModel _channel;

        public RabbitMQDeletingImagePublisher()
        {
            var factory = new ConnectionFactory() { HostName = Environment.GetEnvironmentVariable("RABBITMQ_HOST")??"localhost"};
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