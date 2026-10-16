using System.Net;

namespace Server.Shared.Exception
{
    public class ForbiddenException(ErrorInfo error) :
    ApiException(error.Message, HttpStatusCode.Forbidden, error.Code);
}
