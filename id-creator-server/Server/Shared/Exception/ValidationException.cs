using System.Net;

namespace Server.Shared.Exception
{
    public class ValidationException(string message):
    ApiException(message, HttpStatusCode.BadRequest);
}
