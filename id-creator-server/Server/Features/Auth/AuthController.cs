using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using AutoMapper;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Server.Features.Auth.DTO;
using Server.Features.Auth.Service;
using Server.Features.User.Service;
using Server.Shared.Exception;
using Server.Shared.Http;
using Server.Shared.Model;

namespace Server.Features.Auth
{
    [Route("API/[controller]")]
    [EnableCors("AllowOrigin")]
    public class AuthController(IOAuthService<GoogleJsonWebSignature.Payload> oauthService,
    IUserService userService, 
    ISessionService sessionService, 
    ICookieSessionService cookieSessionService, 
    IJwtTokenService jwtTokenService,
    
    IMapper mapper) : Controller
    {
        [HttpPost("logout")]
        [EnableCors("AllowOrigin")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<Session>>> Logout()
        {
            var refreshTokenId = cookieSessionService.GetSessionCookie(Request);
            if(string.IsNullOrEmpty(refreshTokenId) || !Guid.TryParse(refreshTokenId, out var sessionId))
                throw new UnauthorizedException(ApiErrors.InvalidRefreshToken);
            
            var session = await sessionService.GetSessionById(sessionId);
            if(session==null || session.Expired<=DateTime.Now || session.User?.IsActive != true)
                throw new UnauthorizedException(ApiErrors.SessionExpired);
            await sessionService.DeleteSessionById(session.Id);
            cookieSessionService.DeleteSessionCookie(Request,Response);
            return Ok(ApiResponse<Session>.Ok(session,"Deleted successfully"));
        }

        [HttpGet("status")]
        [EnableCors("AllowOrigin")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<UserSessionProfileDTO>>> Status()
        {
            var sub = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (!Guid.TryParse(sub, out var userId))
                throw new UnauthorizedException(ApiErrors.InvalidAccessToken);

            var user = await userService.GetUserById(userId)
                ?? throw new UnauthorizedException(ApiErrors.AccountInactive);
            if (user.IsBanned())
                throw new UnauthorizedException(ApiErrors.AccountInactive);

            return Ok(ApiResponse<UserSessionProfileDTO>.Ok(
                mapper.Map<UserSessionProfileDTO>(user)));
        }

        [HttpPost("oauth/google")]
        [EnableCors("AllowOrigin")]
        public async Task<ActionResult<ApiResponse<AuthResponseDTO>>> Google([FromBody]string code)
        {   
            var tokenResponse = await oauthService.ExchangeTokenInfoAsync(code) ?? throw new BadRequestException(ApiErrors.GoogleTokenFailed);
            var registerUser = await userService.Login(tokenResponse) ?? throw new ForbiddenException(ApiErrors.UserBanned);
            var session = await  sessionService.AddSession(registerUser.Id);

            cookieSessionService.DeleteSessionCookie(Request,Response);
            cookieSessionService.AddSessionCookie(Response,session.Id, session.Expired);
            var accessToken = jwtTokenService.CreateAccessToken(session.User);
            return Ok(ApiResponse<AuthResponseDTO>.Ok(
                new AuthResponseDTO(accessToken, mapper.Map<UserSessionProfileDTO>(session.User))
            ));
        }

        [HttpPost("refresh")]
        [AllowAnonymous]
        [EnableCors("AllowOrigin")]
        public async Task<IActionResult> Refresh()
        {
            var refreshTokenId = cookieSessionService.GetSessionCookie(Request);
            if(string.IsNullOrEmpty(refreshTokenId) || !Guid.TryParse(refreshTokenId, out var sessionId))
                throw new UnauthorizedException(ApiErrors.InvalidRefreshToken);
            
            var session = await sessionService.GetSessionById(sessionId);
            if(session==null || session.Expired<=DateTime.Now || session.User?.IsActive != true)
                throw new UnauthorizedException(ApiErrors.SessionExpired);

            var newSession = await sessionService.AddSession(session.UserId);
            await sessionService.DeleteSessionById(session.Id);
            cookieSessionService.DeleteSessionCookie(Request,Response);
            cookieSessionService.AddSessionCookie(Response,newSession.Id, newSession.Expired);

            var accessToken = jwtTokenService.CreateAccessToken(session.User);
            return Ok(ApiResponse<AuthResponseDTO>.Ok(
                new AuthResponseDTO(accessToken, mapper.Map<UserSessionProfileDTO>(session.User))
            ));
        }
    }
}