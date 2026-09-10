using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Server.DTOs.Request.User;
using Server.DTOs.Response.Users;
using Server.Filters;
using Server.Interface.ServiceInterface.UserService;
using Server.Interface.UtilInterfaces;
using Server.Util.ApiException;
using Server.Util.Authorization;


namespace Server.Controllers
{
    [ApiController]
    [Route("API/[controller]")]
    [EnableCors("AllowOrigin")]
    public class UserController(IUserService userService, IAuthorizationService authorizationService, IMapper mapper) : Controller
    {
        [HttpGet("{id}")]
        [EnableCors("AllowOrigin")]
        public async Task<ActionResult<ApiResponse<UserProfileResponseDTO>>> FindUser(Guid id)
        {
            var foundUser = await userService.GetUserById(id)
                ?? throw new NotFoundException("Cannot find user.");
            
            var profile = mapper.Map<UserProfileResponseDTO>(foundUser);
            if(User.Identity?.IsAuthenticated == true)
            {
                var sub = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
                if(Guid.TryParse(sub, out var callerId) && callerId == profile.Id)
                    profile.Owned = true;
            }

            return Ok(ApiResponse<UserProfileResponseDTO>.Ok(profile));
        }


        [HttpPut("{id}")]
        [EnableCors("AllowOrigin")]
        [Authorize]
        [ValidationFilter<UpdateUserProfileDTO>]
        public async Task<ActionResult<ApiResponse<UserProfileResponseDTO>>> UpdateUser(Guid id,
        [FromForm] UpdateUserProfileDTO updateUserProfileDTO)
        {
            var authResult = await authorizationService.AuthorizeAsync(User, new OwnedResource(id), "SameUser");
            if (!authResult.Succeeded) throw new ForbiddenException("You are not logged in as this user");

            var updatedUser = await userService.UpdateUser(id, updateUserProfileDTO);

            return updatedUser == null
                ? throw new NotFoundException("User does not exist")
                : (ActionResult<ApiResponse<UserProfileResponseDTO>>)Ok(ApiResponse<UserProfileResponseDTO>.Ok(mapper.Map<UserProfileResponseDTO>(updatedUser)));
        }
    }
}
