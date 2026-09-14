using System.Net;

namespace Server.Shared.Exception
{
    public class ForbiddenException(string message) :
    ApiException(message, HttpStatusCode.Forbidden);
}
