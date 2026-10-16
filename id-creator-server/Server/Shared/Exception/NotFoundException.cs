using System.Net;

namespace Server.Shared.Exception
{
    public class NotFoundException(ErrorInfo error) :
    ApiException(error.Message, HttpStatusCode.NotFound, error.Code);
}
