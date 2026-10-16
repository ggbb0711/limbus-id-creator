using System.Net;

namespace Server.Shared.Exception
{
    public class UnauthorizedException(ErrorInfo error) :
    ApiException(error.Message, HttpStatusCode.Unauthorized, error.Code);
}
