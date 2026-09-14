



namespace Server.Features.Auth.Service
{
    public interface IOAuthService<T>
    {
        Task<T?> ExchangeTokenInfoAsync(string code);
    }
}
