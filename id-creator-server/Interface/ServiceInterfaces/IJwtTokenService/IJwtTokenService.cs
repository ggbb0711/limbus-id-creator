using Server.Models;

namespace Server.Interface.ServiceInterface.IJwtTokenService
{
    public interface IJwtTokenService
    {
        string CreateAccessToken(User user);
    }
}