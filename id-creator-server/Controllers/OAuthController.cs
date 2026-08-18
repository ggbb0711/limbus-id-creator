using AutoMapper;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Server.DTOs.Response.Auth;
using Server.DTOs.Response.Session;
using Server.Interface.ServiceInterface.IJwtTokenService;
using Server.Interface.ServiceInterface.SessionInterface;
using Server.Interface.ServiceInterface.UserService;
using Server.Interface.ServiceInterface.UtilService;
using Server.Interface.UtilInterfaces;
using Server.Models;
using Server.Util.ApiException;

namespace Server.Controllers
{
    [Route("API/[controller]")]
    [EnableCors("AllowOrigin")]
    public class OAuthController(IOAuthService<GoogleJsonWebSignature.Payload> oauthService,
    IUserService userService, 
    ISessionService sessionService, 
    ICookieSessionService cookieSessionService, 
    IJwtTokenService jwtTokenService,
    
    IMapper mapper) : Controller
    {
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
                    await sessionService.DeleteSessionById(((Session)session).Id);
                    response.Response = mapper.Map<UserSessionProfileDTO>(((Session)session).User);
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
                response.Response = mapper.Map<UserSessionProfileDTO>(session.User);
                response.msg = "Login successfully";
            }
            return Ok(response);
        }

        [HttpPost("oauth2/register")]
        [EnableCors("AllowOrigin")]
        public async Task<IActionResult> Register([FromBody]string code)
        {   
            var response = new ResponseService<UserSessionProfileDTO>();

            var tokenResponse = await oauthService.ExchangeTokenInfoAsync(code);
            if(tokenResponse !=null)
            {
                try
                {
                    var registerUser = await userService.GoogleLogin(tokenResponse);
                    if(registerUser == null)
                    {
                        response.msg = "Cannot login";
                        return BadRequest(response);
                    }
                    
                    var session = await  sessionService.AddSession(registerUser.Id);
                    if(session == null)
                    {
                        response.msg = "Cannot create session";
                        return BadRequest(response);
                    }
                    
                    if(session != null) cookieSessionService.AddSessionCookie(Response,session.Id, session.Expired);
                    response.Response = mapper.Map<UserSessionProfileDTO>(registerUser);
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

        [HttpPost("refresh")]
        [AllowAnonymous]
        [EnableCors("AllowOrigin")]
        public async Task<IActionResult> Refresh()
        {
            var refreshTokenId = cookieSessionService.GetSessionCookie(Request);
            if(string.IsNullOrEmpty(refreshTokenId) || !Guid.TryParse(refreshTokenId, out var sessionId))
                throw new UnauthorizedException("Missing or invalid refresh token");
            
            var session = await sessionService.GetSession(sessionId);
            if(session==null || session.Expired<=DateTime.Now || session.User?.IsActive != true)
                throw new UnauthorizedException("Session expired or revoked");

            var newSession = await sessionService.AddSession(session.UserId);
            await sessionService.DeleteSessionById(session.Id);
            cookieSessionService.AddSessionCookie(Response,newSession.Id, newSession.Expired);

            var accessToken = jwtTokenService.CreateAccessToken(session.User);
            return Ok(ApiResponse<AuthResponseDTO>.Ok(
                new AuthResponseDTO(accessToken, mapper.Map<UserSessionProfileDTO>(session.User))
            ));
        }
    }
}