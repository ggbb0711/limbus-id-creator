using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Server.Shared.Authorization;
using Server.Shared.Exception;

namespace Server.Tests.Shared.Authorization
{
    public class ClaimsPrincipalExtensionsTest
    {
        private static ClaimsPrincipal WithSub(string? sub) => new(sub == null
            ? new ClaimsIdentity()
            : new ClaimsIdentity([new Claim(JwtRegisteredClaimNames.Sub, sub)]));

        [Fact]
        public void TryGetUserId_ReturnsTheSubClaim()
        {
            var id = Guid.NewGuid();

            Assert.True(WithSub(id.ToString()).TryGetUserId(out var userId));
            Assert.Equal(id, userId);
        }

        [Theory]
        [InlineData(null)]
        [InlineData("not-a-guid")]
        public void TryGetUserId_ReturnsFalse_WhenSubIsMissingOrInvalid(string? sub)
        {
            Assert.False(WithSub(sub).TryGetUserId(out var userId));
            Assert.Equal(Guid.Empty, userId);
        }

        [Fact]
        public void GetRequiredUserId_ReturnsTheSubClaim()
        {
            var id = Guid.NewGuid();

            Assert.Equal(id, WithSub(id.ToString()).GetRequiredUserId());
        }

        [Theory]
        [InlineData(null)]
        [InlineData("not-a-guid")]
        public void GetRequiredUserId_ThrowsInvalidAccessToken_WhenSubIsMissingOrInvalid(string? sub)
        {
            var exception = Assert.Throws<UnauthorizedException>(() => WithSub(sub).GetRequiredUserId());
            Assert.Equal(ApiErrors.InvalidAccessToken.Code, exception.ErrorCode);
        }
    }
}
