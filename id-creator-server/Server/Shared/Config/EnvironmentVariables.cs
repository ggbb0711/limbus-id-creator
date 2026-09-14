namespace Server.Shared.Config
{

    public class EnvironmentVariables
    {
        public required string FrontendUri { get; init; }
        public required string Mode { get; init; }
        public required string DefaultConnection { get; init; }
        public string? RemoteConnection { get; init; }
        public required string JWTSecret { get; init; }
        public string? ListenOn { get; init; }
        public required string CookieSessionProtectorSecret { get; init; }
        public required string TokenEndpoint { get; init; }
        public required string CloudinaryUrl { get; init; }
        public required string AwsS3BucketName { get; init; }
        public required string AwsAccessKey { get; init; }
        public required string AwsSecretKey { get; init; }
        public required int SessionExpiredDay { get; init; }
        public required RabbitMqOptions RabbitMq { get; init; }
        public required string GoogleClientSecret { get; init; }
        public required string GoogleRedirectUri { get; init; }
        public required string GoogleClientId { get; init; }

        public static EnvironmentVariables LoadFromEnvironment() => new()
        {
            FrontendUri = Require("FrontendUri"),
            Mode = Require("MODE"),
            DefaultConnection = Require("DefaultConnection"),
            RemoteConnection = Environment.GetEnvironmentVariable("RemoteConnection"),
            JWTSecret = Require("JWTSecret"),
            ListenOn = Environment.GetEnvironmentVariable("LISTEN_ON"),
            CookieSessionProtectorSecret = Require("CookieSessionProtectorSecret"),
            TokenEndpoint = Require("TokenEndpoint"),
            CloudinaryUrl = Require("CLOUDINARY_URL"),
            AwsS3BucketName = Require("AWS_S3_BUCKET_NAME"),
            AwsAccessKey = Require("AWS_ACCESS_KEY"),
            AwsSecretKey = Require("AWS_SECRET_KEY"),
            SessionExpiredDay = int.Parse(Require("SessionExpiredDay")),
            GoogleClientId = Require("GOOGLE_CLIENT_ID"),
            GoogleRedirectUri = Require("GOOGLE_REDIRECT_URI"),
            GoogleClientSecret = Require("GOOGLE_CLIENT_SECRET"),
            RabbitMq = new RabbitMqOptions
            {
                Host = Environment.GetEnvironmentVariable("RABBITMQ_HOST") ?? "localhost",
                UserName = Environment.GetEnvironmentVariable("RABBITMQ_HOST_USER_NAME") ?? "guest",
                Password = Environment.GetEnvironmentVariable("RABBITMQ_PASSWORD") ?? "guest",
                VirtualHost = Environment.GetEnvironmentVariable("RABBITMQ_VH") ?? "/",
                RequestedHeartbeatSeconds = int.Parse(Environment.GetEnvironmentVariable("RABBITMQ_REQUESTED_HEARTBEAT") ?? "150"),
            },
        };

        private static string Require(string key) =>
            Environment.GetEnvironmentVariable(key)
            ?? throw new InvalidOperationException($"Missing required environment variable: {key}");

    }

    public class RabbitMqOptions
    {
        public required string Host { get; init; }
        public required string UserName { get; init; }
        public required string Password { get; init; }
        public required string VirtualHost { get; init; }
        public required int RequestedHeartbeatSeconds { get; init; }
    }
}
