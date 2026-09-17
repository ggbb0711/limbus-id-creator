using System.Net;
using Server.Features.Auth.Service;

namespace Server.Tests.Features.Auth.Service
{
    public class GoogleOAuthServiceTest
    {
        private class StaticResponseHandler(HttpStatusCode statusCode) : HttpMessageHandler
        {
            protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken) =>
                Task.FromResult(new HttpResponseMessage(statusCode));
        }

        [Fact]
        public async Task ExchangeTokenInfoAsync_ReturnsNull_WhenTokenEndpointRespondsWithNonSuccessStatus()
        {
            var client = new HttpClient(new StaticResponseHandler(HttpStatusCode.BadRequest));
            var service = new GoogleOAuthService(client, EnvironmentVariablesTestHelper.Create());

            var result = await service.ExchangeTokenInfoAsync("some-code");

            Assert.Null(result);
        }
    }
}
