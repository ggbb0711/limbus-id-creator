using System.Net;

namespace Server.Util.ApiException
{
    public class ValidationException(string message):
    ApiException(message, HttpStatusCode.BadRequest);
}