

namespace RepositoryLayer.Utils.RabbitMQPublisher
{
    public class UploadingImageRabbitMQQueue
    {
        public Guid Id { get; set; }
        public byte[]? ImageFile { get; set; }
        public string Url { get; set; } = "";
        public DateTime lastUpdated { get; set; }
    }
}
    