using System.Net;

namespace Server.Util.ApiException
{
    public abstract class ApiException(string message, HttpStatusCode statusCode, string? errorCode = null)
    : Exception(message)
    {
        public HttpStatusCode StatusCode { get; } = statusCode;
        public string? ErrorCode { get; } = errorCode;
    }

}