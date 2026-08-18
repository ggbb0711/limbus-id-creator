using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Server.DTOs.Response.Users;
using Server.Interface.ServiceInterface.UserService;
using Server.Interface.UtilInterfaces;
using Server.Models;
using Server.Util.ApiException;
using Server.Util.RabbitMQPublisher;


namespace Server.Controllers
{
    [ApiController]
    [Route("API/[controller]")]
    [EnableCors("AllowOrigin")]
    public class UserController(IUserService userService, RabbitMQUploadingImagePublisher publisher, IMapper mapper) : Controller
    {
        [HttpGet("{id}")]
        [EnableCors("AllowOrigin")]
        public async Task<ActionResult<ApiResponse<UserProfileDTO>>> FindUser(Guid id)
        {
            var foundUser = await userService.GetUser(id)
                ?? throw new NotFoundException("Cannot find user.");
            
            var profile = mapper.Map<UserProfileDTO>(foundUser);
            if(User.Identity?.IsAuthenticated == true)
            {
                var sub = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
                if(Guid.TryParse(sub, out var callerId) && callerId == profile.Id)
                    profile.owned = true;
            }

            return Ok(ApiResponse<UserProfileDTO>.Ok(profile));
        }


        [HttpPost("name/{id}")]
        [EnableCors("AllowOrigin")]
        public async Task<IActionResult> UsersPostName(string id,[FromBody] string newName)
        {
            var response = new ResponseService<string>();
            var session = (Session?) HttpContext.Items["Session"];
            
            if(session == null||!session.UserId.ToString().Equals(id))
            {
                response.msg= "Unauthorized";
                return StatusCode(401,response);
            }
            try
            {
                var isGuid = Guid.TryParse(id, out _);
                if(!isGuid)
                {
                    response.msg = "Incorrect id format";
                    return BadRequest(response);
                }

                if(newName.Length>65)
                {
                    response.Response = "";
                    response.msg = "Username cannot be over 65 characters";

                    return StatusCode(400,response);
                }
                var changeUserName = await userService.ChangeUserName(new Guid(id),newName);
                if(changeUserName != null)
                {
                    response.Response = changeUserName;
                    response.msg = "Username changed";

                    return Ok(response);
                }
                else
                {
                    response.msg = "User not found";
                    return StatusCode(204,response);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500,response);
            }
        }

        [HttpPost("change/profile/{id}")]
        [EnableCors("AllowOrigin")]
        public async Task<IActionResult> UsersPostProfile(string id,[FromForm] IFormFile newProfile)
        {
            var response = new ResponseService<string>();
            var session = (Session?) HttpContext.Items["Session"];
            if(newProfile.Length>100000)
            {
                response.msg = "Profile must be <= 100kb";
                return StatusCode(401,response);
            }


            if(session == null||!session.UserId.ToString().Equals(id))
            {
                response.msg= "Unauthorized";
                return StatusCode(401,response);
            }
            try
            {
                var isGuid = Guid.TryParse(id, out _);
                if(!isGuid)
                {
                    response.msg = "Incorrect id format";
                    return BadRequest(response);
                }

                if(newProfile == null)
                {
                    response.Response = "";
                    response.msg = "Cannot find file";

                    return StatusCode(400,response);
                }
                
                var changeUserProfile = await userService.ChangeUserProfile(new Guid(id),newProfile);
                if(changeUserProfile != null)
                {
                    response.Response = changeUserProfile;
                    response.msg = "Userprofile changed";

                    var foundUser = await userService.GetUser(new Guid(id));
                    if(foundUser!=null)
                    {
                        publisher.PushFormFileToRabbitMQ(foundUser.UserIconId,newProfile,foundUser.UserIcon.LastUpdated);
                    }

                    return Ok(response);
                }
                else
                {
                    response.msg = "User not found";
                    return StatusCode(204,response);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                response.msg = "Server error";
                return StatusCode(500,response);
            }
        }
    }
}
