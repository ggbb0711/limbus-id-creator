using Microsoft.AspNetCore.Authorization;
namespace Server.Shared.Authorization
{
    public class SameUserRequirement : IAuthorizationRequirement { }

    public interface IOwnedResource
    {
        Guid UserId { get; init; }
    }

    public class OwnedResource(Guid userId) : IOwnedResource
    {
        public Guid UserId { get; init; } = userId;
    }

    public class SameUserAuthorizationHandler : AuthorizationHandler<SameUserRequirement,IOwnedResource>
    {
        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            SameUserRequirement requirement,
            IOwnedResource resource
        )
        {
            if(context.User.TryGetUserId(out var userId) && resource.UserId == userId)
            {
                context.Succeed(requirement);
            }
            return Task.CompletedTask;
        }
    }
}
