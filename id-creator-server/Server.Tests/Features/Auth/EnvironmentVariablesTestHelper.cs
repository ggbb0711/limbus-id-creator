using Server.Shared.Config;

namespace Server.Tests.Features.Auth
{
    public static class EnvironmentVariablesTestHelper
    {
        public static EnvironmentVariables Create(
            string jwtSecret = "test-jwt-secret-that-is-long-enough-1234567890",
            string cookieSessionProtectorSecret = "test-cookie-protector-secret",
            int sessionExpiredDay = 7,
            string googleClientId = "test-google-client-id",
            string googleClientSecret = "test-google-client-secret",
            string googleRedirectUri = "https://example.com/oauth/callback") => new()
        {
            FrontendUri = "https://example.com",
            Mode = "Test",
            DefaultConnection = "test-connection",
            RemoteConnection = null,
            JWTSecret = jwtSecret,
            ListenOn = null,
            CookieSessionProtectorSecret = cookieSessionProtectorSecret,
            TokenEndpoint = "https://example.com/token",
            AwsS3BucketName = "test-bucket",
            AwsAccessKey = "test-access-key",
            AwsSecretKey = "test-secret-key",
            SessionExpiredDay = sessionExpiredDay,
            GoogleClientId = googleClientId,
            GoogleClientSecret = googleClientSecret,
            GoogleRedirectUri = googleRedirectUri,
            RabbitMq = new RabbitMqOptions
            {
                Host = "localhost",
                UserName = "guest",
                Password = "guest",
                VirtualHost = "/",
                RequestedHeartbeatSeconds = 150,
            },
        };
    }
}
