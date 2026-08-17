using System.Net;

namespace Server.Util.ApiException
{
    public class ConflictException(string message):
    ApiException(message, HttpStatusCode.Conflict);
}