using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using RepositoryLayer.Models;
using ServiceLayer.DTOs.Response.Session;
using ServiceLayer.Interfaces.SessionService;
using ServiceLayer.Interfaces.UserService;
using ServiceLayer.Interfaces.UtilService;
using ServiceLayer.Services.UtilServices;

namespace Server.Controllers
{
    [Route("API/[controller]")]
    [EnableCors("AllowOrigin")]
    public class OAuthController : Controller
    {
        private readonly IOAuthService _oauthService;
        private readonly IUserService _userService;
        private readonly ISessionService _sessionService;
        private readonly ICookieSessionService _cookieSessionService;
        private readonly IMapper _mapper;

        public OAuthController(IOAuthService oauthService, IUserService userService, ISessionService sessionService, ICookieSessionService cookieSessionService, IMapper mapper)
        {
            _oauthService = oauthService;
            _userService = userService;
            _sessionService = sessionService;
            _cookieSessionService = cookieSessionService;
            _mapper = mapper;
        }

        [HttpPost("oauth2/logout")]
        [EnableCors("AllowOrigin")]
        public async Task<IActionResult> Logout()
        {
            var response = new ResponseService<UserSessionProfileDTO>();
            var session = HttpContext.Items["Session"];
            if(session == null)
            {
                response.msg = "User is not login";
                return StatusCode(401,response);
            }
            else
            {
                try
                {
                    await _sessionService.DeleteSessionById(((Session)session).Id);
                    response.Response = _mapper.Map<UserSessionProfileDTO>(((Session)session).User);
                    response.msg = "User logout successfully";
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    return StatusCode(500,response);
                }
            }
            

            return Ok(response);
        }

        [HttpPost("oauth2/login")]
        [EnableCors("AllowOrigin")]
        public IActionResult Login()
        {   

            var response = new ResponseService<UserSessionProfileDTO>();

            var session = (Session?)HttpContext.Items["Session"];

            if(session == null)
            {
                response.msg = "Session is missing or expired";
                return StatusCode(440,response);
            }
            else
            {
                response.Response = _mapper.Map<UserSessionProfileDTO>(session.User);
                response.msg = "Login successfully";
            }
            return Ok(response);
        }

        [HttpPost("oauth2/register")]
        [EnableCors("AllowOrigin")]
        public async Task<IActionResult> Register([FromBody]string code)
        {   
            var response = new ResponseService<UserSessionProfileDTO>();

            var tokenResponse = await _oauthService.ExchangeTokenInfoAsync(code);
            if(tokenResponse !=null)
            {
                try
                {
                    var registerUser = await _userService.Login(tokenResponse);
                    if(registerUser == null)
                    {
                        response.msg = "Cannot login";
                        return BadRequest(response);
                    }
                    
                    var session = await  _sessionService.AddSession(registerUser.Id);
                    if(session == null)
                    {
                        response.msg = "Cannot create session";
                        return BadRequest(response);
                    }
                    
                    if(session != null) _cookieSessionService.AddSessionCookie(Response,session.Id, session.Expired);
                    response.Response = _mapper.Map<UserSessionProfileDTO>(registerUser);
                    response.msg = "User login successfully";
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    return StatusCode(500,response);
                }
            }
            return Ok(response);
        }
    }
}