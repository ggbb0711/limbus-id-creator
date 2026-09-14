using System.Net;

namespace Server.Shared.Exception
{
    public class NotFoundException(string message):
    ApiException(message,HttpStatusCode.NotFound);
}
