using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Server.Features.User;
using Server.Features.User.DTO;
using Server.Features.User.Service;
using Server.Shared.Exception;
using Server.Shared.Http;
using UserModel = Server.Shared.Model.User;

namespace Server.Tests.Features.User
{
    public class UserControllerTest
    {
        private static UserController CreateController(
            Mock<IUserService> userService, Mock<IAuthorizationService> authorizationService,
            Mock<IMapper> mapper, Guid? userId = null)
        {
            var identity = userId.HasValue
                ? new ClaimsIdentity([new Claim(JwtRegisteredClaimNames.Sub, userId.Value.ToString())], "TestAuth")
                : new ClaimsIdentity();

            return new UserController(userService.Object, authorizationService.Object, mapper.Object)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal(identity) },
                },
            };
        }

        [Fact]
        public async Task FindUser_ThrowsNotFoundException_WhenUserDoesNotExist()
        {
            var id = Guid.NewGuid();
            var userService = new Mock<IUserService>();
            var authorizationService = new Mock<IAuthorizationService>();
            var mapper = new Mock<IMapper>();
            userService.Setup(s => s.GetUserById(id)).ReturnsAsync((UserModel?)null);

            var controller = CreateController(userService, authorizationService, mapper);

            await Assert.ThrowsAsync<NotFoundException>(() => controller.FindUser(id));
        }

        [Fact]
        public async Task FindUser_OwnedStaysFalse_WhenAnonymous()
        {
            var id = Guid.NewGuid();
            var foundUser = new UserModel { Id = id };
            var profile = new UserProfileResponseDTO { Id = id };
            var userService = new Mock<IUserService>();
            var authorizationService = new Mock<IAuthorizationService>();
            var mapper = new Mock<IMapper>();
            userService.Setup(s => s.GetUserById(id)).ReturnsAsync(foundUser);
            mapper.Setup(m => m.Map<UserProfileResponseDTO>(foundUser)).Returns(profile);

            var controller = CreateController(userService, authorizationService, mapper);

            var result = await controller.FindUser(id);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var response = Assert.IsType<ApiResponse<UserProfileResponseDTO>>(okResult.Value);
            Assert.False(response.Data!.Owned);
        }

        [Fact]
        public async Task FindUser_SetsOwnedTrue_WhenCallerSubMatchesProfileId()
        {
            var id = Guid.NewGuid();
            var foundUser = new UserModel { Id = id };
            var profile = new UserProfileResponseDTO { Id = id };
            var userService = new Mock<IUserService>();
            var authorizationService = new Mock<IAuthorizationService>();
            var mapper = new Mock<IMapper>();
            userService.Setup(s => s.GetUserById(id)).ReturnsAsync(foundUser);
            mapper.Setup(m => m.Map<UserProfileResponseDTO>(foundUser)).Returns(profile);

            var controller = CreateController(userService, authorizationService, mapper, userId: id);

            var result = await controller.FindUser(id);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var response = Assert.IsType<ApiResponse<UserProfileResponseDTO>>(okResult.Value);
            Assert.True(response.Data!.Owned);
        }

        [Fact]
        public async Task FindUser_OwnedStaysFalse_WhenCallerSubDoesNotMatchProfileId()
        {
            var id = Guid.NewGuid();
            var foundUser = new UserModel { Id = id };
            var profile = new UserProfileResponseDTO { Id = id };
            var userService = new Mock<IUserService>();
            var authorizationService = new Mock<IAuthorizationService>();
            var mapper = new Mock<IMapper>();
            userService.Setup(s => s.GetUserById(id)).ReturnsAsync(foundUser);
            mapper.Setup(m => m.Map<UserProfileResponseDTO>(foundUser)).Returns(profile);

            var controller = CreateController(userService, authorizationService, mapper, userId: Guid.NewGuid());

            var result = await controller.FindUser(id);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var response = Assert.IsType<ApiResponse<UserProfileResponseDTO>>(okResult.Value);
            Assert.False(response.Data!.Owned);
        }

        [Fact]
        public async Task UpdateUser_ThrowsForbiddenException_WhenAuthorizationFails()
        {
            var id = Guid.NewGuid();
            var userService = new Mock<IUserService>();
            var authorizationService = new Mock<IAuthorizationService>();
            var mapper = new Mock<IMapper>();
            authorizationService
                .Setup(a => a.AuthorizeAsync(It.IsAny<ClaimsPrincipal>(), It.IsAny<object>(), "SameUser"))
                .ReturnsAsync(AuthorizationResult.Failed());

            var controller = CreateController(userService, authorizationService, mapper, userId: id);

            await Assert.ThrowsAsync<ForbiddenException>(
                () => controller.UpdateUser(id, new UpdateUserProfileDTO { UserName = "New Name" }));

            userService.Verify(s => s.UpdateUser(It.IsAny<Guid>(), It.IsAny<UpdateUserProfileDTO>()), Times.Never);
        }

        [Fact]
        public async Task UpdateUser_ThrowsNotFoundException_WhenAuthorizedButUserMissing()
        {
            var id = Guid.NewGuid();
            var dto = new UpdateUserProfileDTO { UserName = "New Name" };
            var userService = new Mock<IUserService>();
            var authorizationService = new Mock<IAuthorizationService>();
            var mapper = new Mock<IMapper>();
            authorizationService
                .Setup(a => a.AuthorizeAsync(It.IsAny<ClaimsPrincipal>(), It.IsAny<object>(), "SameUser"))
                .ReturnsAsync(AuthorizationResult.Success());
            userService.Setup(s => s.UpdateUser(id, dto)).ReturnsAsync((UserModel?)null);

            var controller = CreateController(userService, authorizationService, mapper, userId: id);

            await Assert.ThrowsAsync<NotFoundException>(() => controller.UpdateUser(id, dto));
        }

        [Fact]
        public async Task UpdateUser_ReturnsMappedProfile_WhenAuthorizedAndUpdated()
        {
            var id = Guid.NewGuid();
            var dto = new UpdateUserProfileDTO { UserName = "New Name" };
            var updatedUser = new UserModel { Id = id };
            var profile = new UserProfileResponseDTO { Id = id };
            var userService = new Mock<IUserService>();
            var authorizationService = new Mock<IAuthorizationService>();
            var mapper = new Mock<IMapper>();
            authorizationService
                .Setup(a => a.AuthorizeAsync(It.IsAny<ClaimsPrincipal>(), It.IsAny<object>(), "SameUser"))
                .ReturnsAsync(AuthorizationResult.Success());
            userService.Setup(s => s.UpdateUser(id, dto)).ReturnsAsync(updatedUser);
            mapper.Setup(m => m.Map<UserProfileResponseDTO>(updatedUser)).Returns(profile);

            var controller = CreateController(userService, authorizationService, mapper, userId: id);

            var result = await controller.UpdateUser(id, dto);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var response = Assert.IsType<ApiResponse<UserProfileResponseDTO>>(okResult.Value);
            Assert.Same(profile, response.Data);
        }
    }
}
