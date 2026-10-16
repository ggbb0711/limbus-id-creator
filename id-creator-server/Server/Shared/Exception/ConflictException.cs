using System.Net;

namespace Server.Shared.Exception
{
    public class ConflictException(ErrorInfo error) :
    ApiException(error.Message, HttpStatusCode.Conflict, error.Code);
}
