using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Server.Shared.Exception;

namespace Server.Shared.Authorization
{
    public static class ClaimsPrincipalExtensions
    {
        public static bool TryGetUserId(this ClaimsPrincipal user, out Guid userId) =>
            Guid.TryParse(user.FindFirstValue(JwtRegisteredClaimNames.Sub), out userId);

        public static Guid GetRequiredUserId(this ClaimsPrincipal user) =>
            user.TryGetUserId(out var userId) ? userId : throw new UnauthorizedException(ApiErrors.InvalidAccessToken);
    }
}
