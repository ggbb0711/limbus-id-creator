using System.Net;

namespace Server.Util.ApiException
{
    public class ValidationException(string message, IDictionary<string, string[]>? errors=null):
    ApiException(message, HttpStatusCode.BadRequest)
    {
        public IDictionary<string, string[]>? Errors { get; } = errors;
    }
}