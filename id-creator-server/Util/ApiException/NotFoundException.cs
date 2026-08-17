using System.Net;

namespace Server.Util.ApiException
{
    public class NotFoundException(string message): 
    ApiException(message,HttpStatusCode.NotFound);
}