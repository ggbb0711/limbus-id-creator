using System.IdentityModel.Tokens.Jwt;
using Server.Features.Auth.Service;
using UserModel = Server.Shared.Model.User;

namespace Server.Tests.Features.Auth.Service
{
    public class JwtTokenServiceTest
    {
        [Fact]
        public void CreateAccessToken_ProducesTokenWithExpectedClaimsAndExpiry()
        {
            var env = EnvironmentVariablesTestHelper.Create();
            var user = new UserModel { Id = Guid.NewGuid(), UserEmail = "user@example.com" };
            var service = new JwtTokenService(env);

            var before = DateTime.UtcNow;
            var token = service.CreateAccessToken(user);
            var after = DateTime.UtcNow;

            var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

            Assert.Equal(user.Id.ToString(), jwt.Claims.Single(c => c.Type == JwtRegisteredClaimNames.Sub).Value);
            Assert.Equal(user.UserEmail, jwt.Claims.Single(c => c.Type == JwtRegisteredClaimNames.Email).Value);
            Assert.Equal("id-creator-api", jwt.Issuer);
            Assert.Contains("id-creator-client", jwt.Audiences);
            Assert.InRange(jwt.ValidTo, before.AddMinutes(15).AddSeconds(-5), after.AddMinutes(15).AddSeconds(5));
        }
    }
}
