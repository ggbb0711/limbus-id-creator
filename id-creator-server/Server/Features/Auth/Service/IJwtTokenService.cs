namespace Server.Features.Auth.Service
{
    public interface IJwtTokenService
    {
        string CreateAccessToken(UserModel user);
    }
}
