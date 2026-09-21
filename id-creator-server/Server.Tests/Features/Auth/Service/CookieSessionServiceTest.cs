using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Http;
using Server.Features.Auth.Service;

namespace Server.Tests.Features.Auth.Service
{
    public class CookieSessionServiceTest
    {
        private static CookieSessionService CreateService() =>
            new(DataProtectionProvider.Create("test-purpose"), EnvironmentVariablesTestHelper.Create());

        private static string ExtractSessionCookieNameValue(HttpContext responseContext)
        {
            var header = responseContext.Response.Headers.SetCookie
                .Single(h => h!.StartsWith("Session-Cookie=Session-id"));
            return header!.Split(';')[0];
        }

        [Fact]
        public void AddSessionCookie_ThenGetSessionCookie_RoundTripsTheSessionId()
        {
            var service = CreateService();
            var sessionId = Guid.NewGuid();
            var responseContext = new DefaultHttpContext();

            service.AddSessionCookie(responseContext.Response, sessionId, DateTime.Now.AddDays(7));

            var cookieNameValue = ExtractSessionCookieNameValue(responseContext);
            var requestContext = new DefaultHttpContext();
            requestContext.Request.Headers.Append("Cookie", cookieNameValue);

            var result = service.GetSessionCookie(requestContext.Request);

            Assert.Equal(sessionId.ToString(), result);
        }

        [Fact]
        public void GetSessionCookie_ReturnsEmptyString_WhenCookieIsMissing()
        {
            var service = CreateService();
            var requestContext = new DefaultHttpContext();

            var result = service.GetSessionCookie(requestContext.Request);

            Assert.Equal("", result);
        }

        [Fact]
        public void GetSessionCookie_ReturnsEmptyString_WhenCookieValueIsUnprotectable()
        {
            var service = CreateService();
            var requestContext = new DefaultHttpContext();
            requestContext.Request.Headers.Append("Cookie", "Session-Cookie=Session-id=not-a-real-protected-value");

            var result = service.GetSessionCookie(requestContext.Request);

            Assert.Equal("", result);
        }

        [Fact]
        public void DeleteSessionCookie_IssuesDeleteDirective_WhenCookiePresent()
        {
            var service = CreateService();
            var requestContext = new DefaultHttpContext();
            requestContext.Request.Headers.Append("Cookie", "Session-Cookie=Session-id=some-value");
            var responseContext = new DefaultHttpContext();

            service.DeleteSessionCookie(requestContext.Request, responseContext.Response);

            Assert.Contains(
                responseContext.Response.Headers.SetCookie,
                h => h!.StartsWith("Session-Cookie="));
        }

        [Fact]
        public void DeleteSessionCookie_DoesNothing_WhenCookieAbsent()
        {
            var service = CreateService();
            var requestContext = new DefaultHttpContext();
            var responseContext = new DefaultHttpContext();

            service.DeleteSessionCookie(requestContext.Request, responseContext.Response);

            Assert.Equal(0, responseContext.Response.Headers.SetCookie.Count);
        }
    }
}
