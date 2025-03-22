using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using RepositoryLayer.Models;
using RepositoryLayer.Utils.RabbitMQPublisher;
using ServiceLayer.DTOs.Response.Users;
using ServiceLayer.Interfaces.UserService;
using ServiceLayer.Services.UtilServices;


namespace Server.Controllers
{
    [ApiController]
    [Route("API/[controller]")]
    [EnableCors("AllowOrigin")]
    public class UserController : Controller
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        private readonly RabbitMQUploadingImagePublisher _publisher;
        
        public UserController(IUserService userService, RabbitMQUploadingImagePublisher publisher, IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
            _publisher = publisher;
        }
        
        [HttpGet("{id?}")]
        [EnableCors("AllowOrigin")]
        public async Task<IActionResult> Users(string id)
        {
            var response = new ResponseService<UserProfileDTO>();
            var session = (Session?) HttpContext.Items["Session"];

            try
            {
                var isGuid = Guid.TryParse(id, out _);
                if(!isGuid)
                {
                    response.msg = "Incorrect id format";
                    return BadRequest(response);
                }
                var foundUser = await _userService.GetUser(new Guid(id));
                if(foundUser != null)
                {
                    response.Response = _mapper.Map<UserProfileDTO>(foundUser);
                    response.msg = "User found";

                    //Owned is true if the user is login
                    if(session != null && session?.UserId == response.Response.Id) response.Response.owned = true;

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


        [HttpPost("change/name/{id}")]
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
                var changeUserName = await _userService.ChangeUserName(new Guid(id),newName);
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
                
                var changeUserProfile = await _userService.ChangeUserProfile(new Guid(id),newProfile);
                if(changeUserProfile != null)
                {
                    response.Response = changeUserProfile;
                    response.msg = "Userprofile changed";

                    var foundUser = await _userService.GetUser(new Guid(id));
                    if(foundUser!=null)
                    {
                        _publisher.PushFormFileToRabbitMQ(foundUser.UserIconId,newProfile,foundUser.UserIcon.LastUpdated);
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
