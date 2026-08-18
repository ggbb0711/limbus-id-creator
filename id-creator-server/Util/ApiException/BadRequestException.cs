using System.Net;

namespace Server.Util.ApiException
{
    public class BadRequestException(string message): 
        ApiException(message, HttpStatusCode.BadRequest);
}