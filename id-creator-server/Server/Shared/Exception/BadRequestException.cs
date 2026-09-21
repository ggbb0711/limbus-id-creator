using System.Net;

namespace Server.Shared.Exception
{
    public class BadRequestException(string message):
        ApiException(message, HttpStatusCode.BadRequest);
}
