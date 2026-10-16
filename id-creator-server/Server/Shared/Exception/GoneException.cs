using System.Net;

namespace Server.Shared.Exception
{
    public class GoneException(ErrorInfo error) :
    ApiException(error.Message, HttpStatusCode.Gone, error.Code);
}
