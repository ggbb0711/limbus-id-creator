using System.Net;

namespace Server.Util.ApiException
{
    public class ForbiddenException(string message) :
    ApiException(message, HttpStatusCode.Forbidden);
}