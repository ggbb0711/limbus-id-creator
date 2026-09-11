using System.Net;

namespace Server.Shared.Exception
{
    public abstract class ApiException(string message, HttpStatusCode statusCode, string? errorCode = null)
    : System.Exception(message)
    {
        public HttpStatusCode StatusCode { get; } = statusCode;
        public string? ErrorCode { get; } = errorCode;
    }

}
