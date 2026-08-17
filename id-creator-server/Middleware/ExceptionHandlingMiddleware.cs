using System.Net;
using Microsoft.Extensions.ObjectPool;
using Server.Interface.UtilInterfaces;
using Server.Util.ApiException;

namespace Server.Middleware
{
    public class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await next(context);
            }
            catch(ApiException ex)
            {
                logger.LogWarning(ex, $"Handled API exception: {ex.Message}");
                await WriteResponse(context, ex.StatusCode, ApiResponse<object>.Fail(ex.Message, ex.ErrorCode));
            }
            catch(Exception ex)
            {
                logger.LogError(ex, "Unhandled exception");
                await WriteResponse(context, HttpStatusCode.InternalServerError,
                    ApiResponse<object>.Fail("Something went wrong with the server"));
            }
        }

        private static Task WriteResponse(HttpContext context, HttpStatusCode statusCode, object body)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode =(int) statusCode;
            return context.Response.WriteAsJsonAsync(body);
        }
    }

    public static class ExcetpionHandlingMiddlewareExtensions
    {
        public static IApplicationBuilder UseExceptionHandling(this IApplicationBuilder app)=>
            app.UseMiddleware<ExceptionHandlingMiddleware>();
    }
}