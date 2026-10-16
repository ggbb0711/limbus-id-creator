using System.Net;

namespace Server.Shared.Exception
{
    public class BadRequestException(ErrorInfo error) :
    ApiException(error.Message, HttpStatusCode.BadRequest, error.Code);
}
