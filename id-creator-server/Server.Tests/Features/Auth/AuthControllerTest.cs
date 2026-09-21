using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using AutoMapper;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Server.Features.Auth;
using Server.Features.Auth.DTO;
using Server.Features.Auth.Service;
using Server.Features.User.Service;
using Server.Shared.Exception;
using Server.Shared.Http;
using Server.Shared.Model;
using UserModel = Server.Shared.Model.User;

namespace Server.Tests.Features.Auth
{
    public class AuthControllerTest
    {
        private static Session CreateSession(
            Guid? userId = null, bool userActive = true, DateTime? expired = null) => new()
        {
            Id = Guid.NewGuid(),
            UserId = userId ?? Guid.NewGuid(),
            Created = DateTime.Now,
            Expired = expired ?? DateTime.Now.AddDays(7),
            User = new UserModel { Id = userId ?? Guid.NewGuid(), IsActive = userActive },
        };

        private static AuthController CreateController(
            Mock<IOAuthService<GoogleJsonWebSignature.Payload>> oauthService,
            Mock<IUserService> userService,
            Mock<ISessionService> sessionService,
            Mock<ICookieSessionService> cookieSessionService,
            Mock<IJwtTokenService> jwtTokenService,
            Mock<IMapper> mapper,
            Guid? userId = null)
        {
            var identity = userId.HasValue
                ? new ClaimsIdentity([new Claim(JwtRegisteredClaimNames.Sub, userId.Value.ToString())], "TestAuth")
                : new ClaimsIdentity();

            return new AuthController(
                oauthService.Object, userService.Object, sessionService.Object,
                cookieSessionService.Object, jwtTokenService.Object, mapper.Object)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal(identity) },
                },
            };
        }

        private static (
            Mock<IOAuthService<GoogleJsonWebSignature.Payload>> OAuthService,
            Mock<IUserService> UserService,
            Mock<ISessionService> SessionService,
            Mock<ICookieSessionService> CookieSessionService,
            Mock<IJwtTokenService> JwtTokenService,
            Mock<IMapper> Mapper) CreateMocks() =>
            (new(), new(), new(), new(), new(), new());

        [Fact]
        public async Task Logout_ThrowsUnauthorizedException_WhenSessionCookieIsMissing()
        {
            var (oauth, userService, sessionService, cookieService, jwtService, mapper) = CreateMocks();
            cookieService.Setup(s => s.GetSessionCookie(It.IsAny<HttpRequest>())).Returns("");

            var controller = CreateController(oauth, userService, sessionService, cookieService, jwtService, mapper);

            await Assert.ThrowsAsync<UnauthorizedException>(() => controller.Logout());
            sessionService.Verify(s => s.GetSessionById(It.IsAny<Guid>()), Times.Never);
        }

        [Fact]
        public async Task Logout_ThrowsUnauthorizedException_WhenSessionCookieIsNotAGuid()
        {
            var (oauth, userService, sessionService, cookieService, jwtService, mapper) = CreateMocks();
            cookieService.Setup(s => s.GetSessionCookie(It.IsAny<HttpRequest>())).Returns("not-a-guid");

            var controller = CreateController(oauth, userService, sessionService, cookieService, jwtService, mapper);

            await Assert.ThrowsAsync<UnauthorizedException>(() => controller.Logout());
        }

        [Fact]
        public async Task Logout_ThrowsUnauthorizedException_WhenSessionNotFound()
        {
            var sessionId = Guid.NewGuid();
            var (oauth, userService, sessionService, cookieService, jwtService, mapper) = CreateMocks();
            cookieService.Setup(s => s.GetSessionCookie(It.IsAny<HttpRequest>())).Returns(sessionId.ToString());
            sessionService.Setup(s => s.GetSessionById(sessionId)).ReturnsAsync((Session?)null);

            var controller = CreateController(oauth, userService, sessionService, cookieService, jwtService, mapper);

            await Assert.ThrowsAsync<UnauthorizedException>(() => controller.Logout());
        }

        [Fact]
        public async Task Logout_ThrowsUnauthorizedException_WhenSessionExpired()
        {
            var session = CreateSession(expired: DateTime.Now.AddDays(-1));
            var (oauth, userService, sessionService, cookieService, jwtService, mapper) = CreateMocks();
            cookieService.Setup(s => s.GetSessionCookie(It.IsAny<HttpRequest>())).Returns(session.Id.ToString());
            sessionService.Setup(s => s.GetSessionById(session.Id)).ReturnsAsync(session);

            var controller = CreateController(oauth, userService, sessionService, cookieService, jwtService, mapper);

            await Assert.ThrowsAsync<UnauthorizedException>(() => controller.Logout());
        }

        [Fact]
        public async Task Logout_ThrowsUnauthorizedException_WhenUserInactive()
        {
            var session = CreateSession(userActive: false);
            var (oauth, userService, sessionService, cookieService, jwtService, mapper) = CreateMocks();
            cookieService.Setup(s => s.GetSessionCookie(It.IsAny<HttpRequest>())).Returns(session.Id.ToString());
            sessionService.Setup(s => s.GetSessionById(session.Id)).ReturnsAsync(session);

            var controller = CreateController(oauth, userService, sessionService, cookieService, jwtService, mapper);

            await Assert.ThrowsAsync<UnauthorizedException>(() => controller.Logout());
        }

        [Fact]
        public async Task Logout_DeletesSessionAndReturnsIt_WhenValid()
        {
            var session = CreateSession();
            var (oauth, userService, sessionService, cookieService, jwtService, mapper) = CreateMocks();
            cookieService.Setup(s => s.GetSessionCookie(It.IsAny<HttpRequest>())).Returns(session.Id.ToString());
            sessionService.Setup(s => s.GetSessionById(session.Id)).ReturnsAsync(session);
            sessionService.Setup(s => s.DeleteSessionById(session.Id)).ReturnsAsync(session);

            var controller = CreateController(oauth, userService, sessionService, cookieService, jwtService, mapper);

            var result = await controller.Logout();

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equivalent(ApiResponse<Session>.Ok(session, "Deleted successfully"), okResult.Value);
            sessionService.Verify(s => s.DeleteSessionById(session.Id), Times.Once);
        }

        [Fact]
        public async Task Status_ThrowsUnauthorizedException_WhenSubClaimMissing()
        {
            var (oauth, userService, sessionService, cookieService, jwtService, mapper) = CreateMocks();
            var controller = CreateController(oauth, userService, sessionService, cookieService, jwtService, mapper);

            await Assert.ThrowsAsync<UnauthorizedException>(() => controller.Status());
        }

        [Fact]
        public async Task Status_ThrowsUnauthorizedException_WhenUserNotFound()
        {
            var userId = Guid.NewGuid();
            var (oauth, userService, sessionService, cookieService, jwtService, mapper) = CreateMocks();
            userService.Setup(s => s.GetUserById(userId)).ReturnsAsync((UserModel?)null);

            var controller = CreateController(oauth, userService, sessionService, cookieService, jwtService, mapper, userId);

            await Assert.ThrowsAsync<UnauthorizedException>(() => controller.Status());
        }

        [Fact]
        public async Task Status_ReturnsMappedProfile_WhenFound()
        {
            var userId = Guid.NewGuid();
            var user = new UserModel { Id = userId };
            var profile = new UserSessionProfileDTO { Id = userId };
            var (oauth, userService, sessionService, cookieService, jwtService, mapper) = CreateMocks();
            userService.Setup(s => s.GetUserById(userId)).ReturnsAsync(user);
            mapper.Setup(m => m.Map<UserSessionProfileDTO>(user)).Returns(profile);

            var controller = CreateController(oauth, userService, sessionService, cookieService, jwtService, mapper, userId);

            var result = await controller.Status();

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var response = Assert.IsType<ApiResponse<UserSessionProfileDTO>>(okResult.Value);
            Assert.Same(profile, response.Data);
        }

        [Fact]
        public async Task Google_ThrowsBadRequestException_WhenExchangeReturnsNull()
        {
            var (oauth, userService, sessionService, cookieService, jwtService, mapper) = CreateMocks();
            oauth.Setup(s => s.ExchangeTokenInfoAsync("code")).ReturnsAsync((GoogleJsonWebSignature.Payload?)null);

            var controller = CreateController(oauth, userService, sessionService, cookieService, jwtService, mapper);

            await Assert.ThrowsAsync<BadRequestException>(() => controller.Google("code"));
        }

        [Fact]
        public async Task Google_ThrowsUnauthorizedAccessException_WhenLoginReturnsNull()
        {
            var payload = new GoogleJsonWebSignature.Payload { Email = "user@example.com" };
            var (oauth, userService, sessionService, cookieService, jwtService, mapper) = CreateMocks();
            oauth.Setup(s => s.ExchangeTokenInfoAsync("code")).ReturnsAsync(payload);
            userService.Setup(s => s.Login(payload)).ReturnsAsync((UserModel?)null);

            var controller = CreateController(oauth, userService, sessionService, cookieService, jwtService, mapper);

            await Assert.ThrowsAsync<UnauthorizedAccessException>(() => controller.Google("code"));
        }

        [Fact]
        public async Task Google_CreatesSessionAndReturnsToken_WhenSuccessful()
        {
            var payload = new GoogleJsonWebSignature.Payload { Email = "user@example.com" };
            var registeredUser = new UserModel { Id = Guid.NewGuid() };
            var session = CreateSession(userId: registeredUser.Id);
            var profile = new UserSessionProfileDTO { Id = registeredUser.Id };
            var (oauth, userService, sessionService, cookieService, jwtService, mapper) = CreateMocks();
            oauth.Setup(s => s.ExchangeTokenInfoAsync("code")).ReturnsAsync(payload);
            userService.Setup(s => s.Login(payload)).ReturnsAsync(registeredUser);
            sessionService.Setup(s => s.AddSession(registeredUser.Id)).ReturnsAsync(session);
            jwtService.Setup(s => s.CreateAccessToken(session.User)).Returns("access-token");
            mapper.Setup(m => m.Map<UserSessionProfileDTO>(session.User)).Returns(profile);

            var controller = CreateController(oauth, userService, sessionService, cookieService, jwtService, mapper);

            var result = await controller.Google("code");

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equivalent(
                ApiResponse<AuthResponseDTO>.Ok(new AuthResponseDTO("access-token", profile)),
                okResult.Value);
            cookieService.Verify(
                s => s.AddSessionCookie(It.IsAny<HttpResponse>(), session.Id, session.Expired),
                Times.Once);
        }

        [Fact]
        public async Task Refresh_ThrowsUnauthorizedException_WhenSessionCookieIsMissing()
        {
            var (oauth, userService, sessionService, cookieService, jwtService, mapper) = CreateMocks();
            cookieService.Setup(s => s.GetSessionCookie(It.IsAny<HttpRequest>())).Returns("");

            var controller = CreateController(oauth, userService, sessionService, cookieService, jwtService, mapper);

            await Assert.ThrowsAsync<UnauthorizedException>(() => controller.Refresh());
        }

        [Fact]
        public async Task Refresh_ThrowsUnauthorizedException_WhenSessionExpired()
        {
            var session = CreateSession(expired: DateTime.Now.AddMinutes(-1));
            var (oauth, userService, sessionService, cookieService, jwtService, mapper) = CreateMocks();
            cookieService.Setup(s => s.GetSessionCookie(It.IsAny<HttpRequest>())).Returns(session.Id.ToString());
            sessionService.Setup(s => s.GetSessionById(session.Id)).ReturnsAsync(session);

            var controller = CreateController(oauth, userService, sessionService, cookieService, jwtService, mapper);

            await Assert.ThrowsAsync<UnauthorizedException>(() => controller.Refresh());
        }

        [Fact]
        public async Task Refresh_ThrowsUnauthorizedException_WhenUserInactive()
        {
            var session = CreateSession(userActive: false);
            var (oauth, userService, sessionService, cookieService, jwtService, mapper) = CreateMocks();
            cookieService.Setup(s => s.GetSessionCookie(It.IsAny<HttpRequest>())).Returns(session.Id.ToString());
            sessionService.Setup(s => s.GetSessionById(session.Id)).ReturnsAsync(session);

            var controller = CreateController(oauth, userService, sessionService, cookieService, jwtService, mapper);

            await Assert.ThrowsAsync<UnauthorizedException>(() => controller.Refresh());
        }

        [Fact]
        public async Task Refresh_RotatesSessionAndReturnsToken_UsingOldSessionUserForAccessToken()
        {
            var oldSession = CreateSession();
            var newSession = CreateSession(userId: oldSession.UserId);
            var profile = new UserSessionProfileDTO { Id = oldSession.UserId };
            var (oauth, userService, sessionService, cookieService, jwtService, mapper) = CreateMocks();
            cookieService.Setup(s => s.GetSessionCookie(It.IsAny<HttpRequest>())).Returns(oldSession.Id.ToString());
            sessionService.Setup(s => s.GetSessionById(oldSession.Id)).ReturnsAsync(oldSession);
            sessionService.Setup(s => s.AddSession(oldSession.UserId)).ReturnsAsync(newSession);
            sessionService.Setup(s => s.DeleteSessionById(oldSession.Id)).ReturnsAsync(oldSession);
            jwtService.Setup(s => s.CreateAccessToken(oldSession.User)).Returns("new-access-token");
            mapper.Setup(m => m.Map<UserSessionProfileDTO>(oldSession.User)).Returns(profile);

            var controller = CreateController(oauth, userService, sessionService, cookieService, jwtService, mapper);

            var result = await controller.Refresh();

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equivalent(
                ApiResponse<AuthResponseDTO>.Ok(new AuthResponseDTO("new-access-token", profile)),
                okResult.Value);
            sessionService.Verify(s => s.AddSession(oldSession.UserId), Times.Once);
            sessionService.Verify(s => s.DeleteSessionById(oldSession.Id), Times.Once);
            cookieService.Verify(
                s => s.AddSessionCookie(It.IsAny<HttpResponse>(), newSession.Id, newSession.Expired),
                Times.Once);
            jwtService.Verify(s => s.CreateAccessToken(oldSession.User), Times.Once);
            jwtService.Verify(s => s.CreateAccessToken(newSession.User), Times.Never);
        }
    }
}
