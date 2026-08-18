using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
namespace Server.Util.Authorization
{
    public class SameUserRequirement : IAuthorizationRequirement { }

    public interface IOwnedResource
    {
        Guid UserId { get; }
    }

    public class SameUserAuthorizationHandler : AuthorizationHandler<SameUserRequirement,IOwnedResource>
    {
        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context, 
            SameUserRequirement requirement,
            IOwnedResource resource
        )
        {
            var sub = context.User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if(Guid.TryParse(sub, out var userId) && resource.UserId == userId)
            {
                context.Succeed(requirement);
            }
            return Task.CompletedTask;
        }
    }
}