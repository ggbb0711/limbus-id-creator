using System.Net;
using Microsoft.AspNetCore.Diagnostics;
using Server.Shared.Exception;
using Server.Shared.Http;

namespace Server.Shared.Middleware
{
    public class ApiExceptionHandler(ILogger<ApiExceptionHandler> logger) : IExceptionHandler
    {
        public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, System.Exception exception, CancellationToken cancellationToken)
        {
            if (exception is not ApiException apiException) return false;

            logger.LogWarning(exception, "Handled API exception: {Message}", exception.Message);

            httpContext.Response.ContentType = "application/json";
            httpContext.Response.StatusCode = (int)apiException.StatusCode;
            await httpContext.Response.WriteAsJsonAsync(
                ApiResponse<object>.Fail(apiException.Message, apiException.ErrorCode), cancellationToken);

            return true;
        }
    }

    public class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
    {
        public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, System.Exception exception, CancellationToken cancellationToken)
        {
            logger.LogError(exception, "Unhandled exception");

            httpContext.Response.ContentType = "application/json";
            httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            await httpContext.Response.WriteAsJsonAsync(
                ApiResponse<object>.Fail("Something went wrong with the server"), cancellationToken);

            return true;
        }
    }
}
