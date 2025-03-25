


using RepositoryLayer.Utils.Obj;

namespace ServiceLayer.Interfaces.UtilService
{
    public interface IOAuthService
    {
        Task<UserOAuthReponse?> ExchangeTokenInfoAsync(string code);
    }
}