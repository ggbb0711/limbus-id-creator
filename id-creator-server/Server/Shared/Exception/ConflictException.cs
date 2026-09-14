using System.Net;

namespace Server.Shared.Exception
{
    public class ConflictException(string message):
    ApiException(message, HttpStatusCode.Conflict);
}
