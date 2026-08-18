


using Server.Models;

namespace Server.Interface.ServiceInterface.UtilService
{
    public interface IOAuthService<T>
    {
        Task<T?> ExchangeTokenInfoAsync(string code);
    }
}