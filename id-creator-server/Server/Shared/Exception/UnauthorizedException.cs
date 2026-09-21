using System.Net;

namespace Server.Shared.Exception
{
    public class UnauthorizedException(string message) :
    ApiException(message, HttpStatusCode.Unauthorized);
}
