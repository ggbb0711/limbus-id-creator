using Google.Apis.Auth;
using Moq;
using Server.Features.User.DTO;
using Server.Features.User.Repository;
using Server.Features.User.Service;
using Server.Shared.Http;
using Server.Shared.Model;
using Server.Tests.Features.SaveInfo;
using UserModel = Server.Shared.Model.User;

namespace Server.Tests.Features.User.Service
{
    public class UserServiceTest
    {
        private static UserModel CreateUser(bool isActive = true, bool isRemoved = false, string email = "user@example.com") => new()
        {
            Id = Guid.NewGuid(),
            UserEmail = email,
            UserName = "Existing User",
            IsActive = isActive,
            IsRemoved = isRemoved,
            UserIcon = new ImageObj { Url = "https://example.com/icon.png" },
        };

        [Fact]
        public async Task GetUserById_ReturnsUser_WhenFound()
        {
            var user = CreateUser();
            var repository = new Mock<IUserRepository>();
            repository.Setup(r => r.GetByIdAsync(user.Id)).ReturnsAsync(user);

            var service = new UserService(repository.Object);
            var result = await service.GetUserById(user.Id);

            Assert.Same(user, result);
        }

        [Fact]
        public async Task GetUserById_ReturnsNull_WhenNotFound()
        {
            var id = Guid.NewGuid();
            var repository = new Mock<IUserRepository>();
            repository.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((UserModel?)null);

            var service = new UserService(repository.Object);
            var result = await service.GetUserById(id);

            Assert.Null(result);
        }

        [Fact]
        public async Task Login_ReturnsExistingUser_WhenFoundAndActive()
        {
            var existingUser = CreateUser(email: "user@example.com");
            var repository = new Mock<IUserRepository>();
            repository
                .Setup(r => r.FindAsync(It.IsAny<RepositoryGetParams<UserModel>>()))
                .ReturnsAsync((RepositoryGetParams<UserModel> p) =>
                    new List<UserModel> { existingUser }.AsQueryable().Where(p.Filter!).AsEnumerable());

            var payload = new GoogleJsonWebSignature.Payload { Email = "user@example.com", Name = "Google Name", Picture = "https://google.com/pic.png" };
            var service = new UserService(repository.Object);

            var result = await service.Login(payload);

            Assert.Same(existingUser, result);
            repository.Verify(r => r.AddAsync(It.IsAny<UserModel>()), Times.Never);
            repository.Verify(r => r.SaveChangeAsync(), Times.Never);
        }

        [Theory]
        [InlineData(false, false)]
        [InlineData(true, true)]
        public async Task Login_ReturnsNull_WhenExistingUserIsInactiveOrRemoved(bool isActive, bool isRemoved)
        {
            var existingUser = CreateUser(isActive: isActive, isRemoved: isRemoved, email: "user@example.com");
            var repository = new Mock<IUserRepository>();
            repository
                .Setup(r => r.FindAsync(It.IsAny<RepositoryGetParams<UserModel>>()))
                .ReturnsAsync((RepositoryGetParams<UserModel> p) =>
                    new List<UserModel> { existingUser }.AsQueryable().Where(p.Filter!).AsEnumerable());

            var payload = new GoogleJsonWebSignature.Payload { Email = "user@example.com", Name = "Google Name", Picture = "https://google.com/pic.png" };
            var service = new UserService(repository.Object);

            var result = await service.Login(payload);

            Assert.Null(result);
        }

        [Fact]
        public async Task Login_CreatesNewUser_WhenNoneFound()
        {
            var repository = new Mock<IUserRepository>();
            repository
                .Setup(r => r.FindAsync(It.IsAny<RepositoryGetParams<UserModel>>()))
                .ReturnsAsync(Enumerable.Empty<UserModel>());
            repository.Setup(r => r.AddAsync(It.IsAny<UserModel>())).ReturnsAsync((UserModel u) => u);
            repository.Setup(r => r.SaveChangeAsync()).Returns(Task.CompletedTask);

            var payload = new GoogleJsonWebSignature.Payload
            {
                Email = "new@example.com",
                Name = "New User",
                Picture = "https://google.com/new.png",
            };
            var service = new UserService(repository.Object);

            var result = await service.Login(payload);

            Assert.NotNull(result);
            Assert.Equal("new@example.com", result!.UserEmail);
            Assert.Equal("New User", result.UserName);
            Assert.Equal("https://google.com/new.png", result.UserIcon.Url);
            repository.Verify(r => r.AddAsync(It.IsAny<UserModel>()), Times.Once);
            repository.Verify(r => r.SaveChangeAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdateUser_ReturnsNull_WhenNotFound()
        {
            var id = Guid.NewGuid();
            var repository = new Mock<IUserRepository>();
            repository.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((UserModel?)null);

            var service = new UserService(repository.Object);
            var result = await service.UpdateUser(id, new UpdateUserProfileDTO { UserName = "New Name" });

            Assert.Null(result);
            repository.Verify(r => r.UpdateAsync(It.IsAny<UserModel>()), Times.Never);
            repository.Verify(r => r.SaveChangeAsync(), Times.Never);
        }

        [Fact]
        public async Task UpdateUser_UpdatesUserName_WhenIconFileNotProvided()
        {
            var user = CreateUser();
            var originalIconUrl = user.UserIcon.Url;
            var repository = new Mock<IUserRepository>();
            repository.Setup(r => r.GetByIdAsync(user.Id)).ReturnsAsync(user);
            repository.Setup(r => r.UpdateAsync(user)).ReturnsAsync(user);
            repository.Setup(r => r.SaveChangeAsync()).Returns(Task.CompletedTask);

            var service = new UserService(repository.Object);
            var result = await service.UpdateUser(user.Id, new UpdateUserProfileDTO { UserName = "Updated Name" });

            Assert.Same(user, result);
            Assert.Equal("Updated Name", user.UserName);
            Assert.Equal(originalIconUrl, user.UserIcon.Url);
            repository.Verify(r => r.UpdateAsync(user), Times.Once);
            repository.Verify(r => r.SaveChangeAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdateUser_UpdatesIconUrlAndLastUpdated_WhenIconFileProvided()
        {
            var user = CreateUser();
            var iconBytes = "new-icon-bytes"u8.ToArray();
            var iconFile = MockSaveData.CreateFakeFormFile(iconBytes).Object;
            var repository = new Mock<IUserRepository>();
            repository.Setup(r => r.GetByIdAsync(user.Id)).ReturnsAsync(user);
            repository.Setup(r => r.UpdateAsync(user)).ReturnsAsync(user);
            repository.Setup(r => r.SaveChangeAsync()).Returns(Task.CompletedTask);

            var service = new UserService(repository.Object);
            await service.UpdateUser(user.Id, new UpdateUserProfileDTO { UserName = "", UserIconFile = iconFile });

            Assert.Equal("data:image/png;base64," + Convert.ToBase64String(iconBytes), user.UserIcon.Url);
        }
    }
}
