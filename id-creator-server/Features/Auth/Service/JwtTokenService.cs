using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using DotNetEnv;
using Microsoft.IdentityModel.Tokens;
using Server.Shared.Config;

namespace Server.Features.Auth.Service
{
    public class JwtTokenService(EnvironmentVariables env) : IJwtTokenService
    {
        private static readonly TimeSpan AccessTokenLifeTime = TimeSpan.FromMinutes(15);
        private readonly SymmetricSecurityKey _key =
            new (Encoding.UTF8.GetBytes(env.JWTSecret));

        public string CreateAccessToken(UserModel user)
        {
            var claims = new []
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email,user.UserEmail),
            };

            var token = new JwtSecurityToken(
                issuer: "id-creator-api",
                audience: "id-creator-client",
                claims: claims,
                expires: DateTime.UtcNow.Add(AccessTokenLifeTime),
                signingCredentials: new SigningCredentials(_key, SecurityAlgorithms.HmacSha256)
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
