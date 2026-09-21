using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using Server.Shared.Exception;
using Server.Shared.Http;
using Server.Shared.Middleware;

namespace Server.Tests.Shared.Middleware
{
    public class GlobalExceptionHandlerTest
    {
        private class TestApiException(string message, HttpStatusCode statusCode, string? errorCode = null)
            : ApiException(message, statusCode, errorCode);

        private static DefaultHttpContext CreateHttpContext()
        {
            var context = new DefaultHttpContext();
            context.Response.Body = new MemoryStream();
            return context;
        }

        private static async Task<ApiResponse<object>?> ReadBodyAsync(HttpContext context)
        {
            context.Response.Body.Seek(0, SeekOrigin.Begin);
            return await JsonSerializer.DeserializeAsync<ApiResponse<object>>(
                context.Response.Body,
                new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
        }

        [Fact]
        public async Task ApiExceptionHandler_ReturnsFalse_WhenExceptionIsNotApiException()
        {
            var logger = new Mock<ILogger<ApiExceptionHandler>>();
            var handler = new ApiExceptionHandler(logger.Object);
            var httpContext = CreateHttpContext();
            var exception = new InvalidOperationException("boom");

            var result = await handler.TryHandleAsync(httpContext, exception, CancellationToken.None);

            Assert.False(result);
            Assert.Equal(200, httpContext.Response.StatusCode);
            Assert.Equal(0, httpContext.Response.Body.Length);
        }

        [Fact]
        public async Task ApiExceptionHandler_HandlesException_WhenExceptionIsApiException()
        {
            var logger = new Mock<ILogger<ApiExceptionHandler>>();
            var handler = new ApiExceptionHandler(logger.Object);
            var httpContext = CreateHttpContext();
            var exception = new TestApiException("invalid request", HttpStatusCode.BadRequest, "BAD_REQUEST");

            var result = await handler.TryHandleAsync(httpContext, exception, CancellationToken.None);

            Assert.True(result);
            Assert.Equal((int)HttpStatusCode.BadRequest, httpContext.Response.StatusCode);
            Assert.Equal("application/json; charset=utf-8", httpContext.Response.ContentType);

            var body = await ReadBodyAsync(httpContext);
            Assert.Equivalent(ApiResponse<object>.Fail("invalid request", "BAD_REQUEST"), body);

            logger.Verify(
                l => l.Log(
                    LogLevel.Warning,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((state, t) => state.ToString()!.Contains("invalid request")),
                    exception,
                    It.IsAny<Func<It.IsAnyType, System.Exception?, string>>()),
                Times.Once);
        }

        [Fact]
        public async Task GlobalExceptionHandler_AlwaysReturnsTrue_AndReturnsInternalServerError()
        {
            var logger = new Mock<ILogger<GlobalExceptionHandler>>();
            var handler = new GlobalExceptionHandler(logger.Object);
            var httpContext = CreateHttpContext();
            var exception = new InvalidOperationException("unexpected");

            var result = await handler.TryHandleAsync(httpContext, exception, CancellationToken.None);

            Assert.True(result);
            Assert.Equal((int)HttpStatusCode.InternalServerError, httpContext.Response.StatusCode);
            Assert.Equal("application/json; charset=utf-8", httpContext.Response.ContentType);

            var body = await ReadBodyAsync(httpContext);
            Assert.Equivalent(ApiResponse<object>.Fail("Something went wrong with the server"), body);

            logger.Verify(
                l => l.Log(
                    LogLevel.Error,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((state, t) => state.ToString()!.Contains("Unhandled exception")),
                    exception,
                    It.IsAny<Func<It.IsAnyType, System.Exception?, string>>()),
                Times.Once);
        }
    }
}
