


using Server.Models;

namespace Server.Interface.ServiceInterface.UtilService
{
    public interface IOAuthService
    {
        Task<UserOAuthReponse?> ExchangeTokenInfoAsync(string code);
    }
}