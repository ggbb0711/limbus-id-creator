using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Server.Shared.Authorization;

namespace Server.Tests.Shared.Authorization
{
    public class SameUserAuthorizationHandlerTest
    {
        private static ClaimsPrincipal CreatePrincipal(Guid? subject)
        {
            var claims = subject is null
                ? []
                : new List<Claim> { new(JwtRegisteredClaimNames.Sub, subject.Value.ToString()) };
            return new ClaimsPrincipal(new ClaimsIdentity(claims));
        }

        private static AuthorizationHandlerContext CreateContext(ClaimsPrincipal user, IOwnedResource resource) =>
            new([new SameUserRequirement()], user, resource);

        [Fact]
        public async Task HandleAsync_Succeeds_WhenResourceUserIdMatchesClaimUserId()
        {
            var userId = Guid.NewGuid();
            var context = CreateContext(CreatePrincipal(userId), new OwnedResource(userId));
            var handler = new SameUserAuthorizationHandler();

            await handler.HandleAsync(context);

            Assert.True(context.HasSucceeded);
        }

        [Fact]
        public async Task HandleAsync_DoesNotSucceed_WhenResourceUserIdDiffersFromClaimUserId()
        {
            var context = CreateContext(CreatePrincipal(Guid.NewGuid()), new OwnedResource(Guid.NewGuid()));
            var handler = new SameUserAuthorizationHandler();

            await handler.HandleAsync(context);

            Assert.False(context.HasSucceeded);
        }

        [Fact]
        public async Task HandleAsync_DoesNotSucceed_WhenSubClaimIsMissing()
        {
            var context = CreateContext(CreatePrincipal(null), new OwnedResource(Guid.NewGuid()));
            var handler = new SameUserAuthorizationHandler();

            await handler.HandleAsync(context);

            Assert.False(context.HasSucceeded);
        }
    }
}
