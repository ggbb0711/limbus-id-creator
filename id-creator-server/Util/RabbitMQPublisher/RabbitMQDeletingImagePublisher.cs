using System.Text;
using RabbitMQ.Client;
using Server.Util.Config;

namespace Server.Util.RabbitMQPublisher
{
    public class RabbitMQDeletingImagePublisher
    {
        private readonly IConnection _connection;
        private readonly IModel _channel;

        public RabbitMQDeletingImagePublisher(EnvironmentVariables env)
        {
            var factory = new ConnectionFactory() { HostName = env.RabbitMq.Host??"localhost",
                UserName = env.RabbitMq.UserName??"guest",
                Password = env.RabbitMq.Password??"guest",
                VirtualHost = env.RabbitMq.VirtualHost??"/",
                RequestedHeartbeat = TimeSpan.FromSeconds(env.RabbitMq.RequestedHeartbeatSeconds)};
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