using System.Net;

namespace Server.Util.ApiException
{
    public class UnauthorizedException(string message) : 
    ApiException(message, HttpStatusCode.Unauthorized);
}