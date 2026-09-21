using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using AutoFixture;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Server.Features.SaveInfo;
using Server.Features.SaveInfo.DTO;
using Server.Features.SaveInfo.Repository;
using Server.Features.SaveInfo.Service;
using Server.Shared.Authorization;
using Server.Shared.Exception;
using Server.Shared.Http;
using Server.Shared.Model;

namespace Server.Tests.Features.SaveInfo
{
    public class SaveEGOInfoControllerTest
    {
        private static ClaimsPrincipal CreatePrincipal(string? sub) =>
            new(new ClaimsIdentity(sub != null ? [new Claim(JwtRegisteredClaimNames.Sub, sub)] : []));

        private static SaveInfoResponseDTO<SavedEgoRequestDTO> CreateResponseDto() => new()
        {
            SaveInfo = new SavedEgoRequestDTO
            {
                SplashArtTranslation = new SplashArtTranslationObj(),
                SinResistant = new SavedEgoRequestDTO.SinResistantObj(),
                SinCost = new SavedEgoRequestDTO.SinCostObj(),
                SkillDetails = [],
            },
        };

        private static SavedInfoRequestDTO<SavedEgoRequestDTO> CreateRequestDto(Guid? id = null) => new()
        {
            Id = id ?? Guid.NewGuid(),
            SaveInfo = new SavedEgoRequestDTO
            {
                SplashArtTranslation = new SplashArtTranslationObj(),
                SinResistant = new SavedEgoRequestDTO.SinResistantObj(),
                SinCost = new SavedEgoRequestDTO.SinCostObj(),
                SkillDetails = [],
            },
        };

        [Fact]
        public async Task GetSavedInfo_ThrowsNotFoundException_WhenSaveDoesNotExist()
        {
            var serviceMock = new Mock<ISavedInfoService<SavedEGOInfo, SavedEgo>>();
            var authMock = new Mock<IAuthorizationService>();
            var mapperMock = new Mock<IMapper>();

            var saveId = Guid.NewGuid();
            serviceMock.Setup(s => s.FindSavedInfoById(saveId, false)).ReturnsAsync((SavedEGOInfo?)null);

            var controller = new SaveEGOInfoController(serviceMock.Object, authMock.Object, mapperMock.Object);

            var ex = await Assert.ThrowsAsync<NotFoundException>(() => controller.GetSavedInfo(saveId, false));
            Assert.Equal("Save does not exist", ex.Message);
            authMock.Verify(a => a.AuthorizeAsync(It.IsAny<ClaimsPrincipal>(), It.IsAny<object>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task GetSavedInfo_ThrowsForbiddenException_WhenNotAuthorized()
        {
            var serviceMock = new Mock<ISavedInfoService<SavedEGOInfo, SavedEgo>>();
            var authMock = new Mock<IAuthorizationService>();
            var mapperMock = new Mock<IMapper>();

            var fixture = new Fixture();
            var entry = MockSaveData.CreateSavedEgoEntry(fixture, Guid.NewGuid(), "Effect");

            serviceMock.Setup(s => s.FindSavedInfoById(entry.Id, false)).ReturnsAsync(entry);
            authMock.Setup(a => a.AuthorizeAsync(It.IsAny<ClaimsPrincipal>(), It.IsAny<object>(), "SameUser"))
                .ReturnsAsync(AuthorizationResult.Failed());

            var controller = new SaveEGOInfoController(serviceMock.Object, authMock.Object, mapperMock.Object);

            var ex = await Assert.ThrowsAsync<ForbiddenException>(() => controller.GetSavedInfo(entry.Id, false));
            Assert.Equal("You do not own this resource.", ex.Message);
        }

        [Fact]
        public async Task GetSavedInfo_ReturnsOkWithMappedData_WhenAuthorized()
        {
            var serviceMock = new Mock<ISavedInfoService<SavedEGOInfo, SavedEgo>>();
            var authMock = new Mock<IAuthorizationService>();
            var mapperMock = new Mock<IMapper>();

            var fixture = new Fixture();
            var entry = MockSaveData.CreateSavedEgoEntry(fixture, Guid.NewGuid(), "Effect");
            var responseDto = CreateResponseDto();

            serviceMock.Setup(s => s.FindSavedInfoById(entry.Id, false)).ReturnsAsync(entry);
            authMock.Setup(a => a.AuthorizeAsync(It.IsAny<ClaimsPrincipal>(), It.IsAny<object>(), "SameUser"))
                .ReturnsAsync(AuthorizationResult.Success());
            mapperMock.Setup(m => m.Map<SaveInfoResponseDTO<SavedEgoRequestDTO>>(entry)).Returns(responseDto);

            var controller = new SaveEGOInfoController(serviceMock.Object, authMock.Object, mapperMock.Object);

            var result = await controller.GetSavedInfo(entry.Id, false);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equivalent(ApiResponse<SaveInfoResponseDTO<SavedEgoRequestDTO>>.Ok(responseDto), okResult.Value);
        }

        [Fact]
        public async Task GetSavedInfo_ForwardsIncludeSkill_ToService()
        {
            var serviceMock = new Mock<ISavedInfoService<SavedEGOInfo, SavedEgo>>();
            var authMock = new Mock<IAuthorizationService>();
            var mapperMock = new Mock<IMapper>();

            var fixture = new Fixture();
            var entry = MockSaveData.CreateSavedEgoEntry(fixture, Guid.NewGuid(), "Effect");

            serviceMock.Setup(s => s.FindSavedInfoById(entry.Id, true)).ReturnsAsync(entry);
            authMock.Setup(a => a.AuthorizeAsync(It.IsAny<ClaimsPrincipal>(), It.IsAny<object>(), "SameUser"))
                .ReturnsAsync(AuthorizationResult.Success());
            mapperMock.Setup(m => m.Map<SaveInfoResponseDTO<SavedEgoRequestDTO>>(entry)).Returns(CreateResponseDto());

            var controller = new SaveEGOInfoController(serviceMock.Object, authMock.Object, mapperMock.Object);

            await controller.GetSavedInfo(entry.Id, includeSkill: true);

            serviceMock.Verify(s => s.FindSavedInfoById(entry.Id, true), Times.Once);
        }

        [Fact]
        public async Task GetSavedInfos_ThrowsForbiddenException_WhenNotAuthorized()
        {
            var serviceMock = new Mock<ISavedInfoService<SavedEGOInfo, SavedEgo>>();
            var authMock = new Mock<IAuthorizationService>();
            var mapperMock = new Mock<IMapper>();

            authMock.Setup(a => a.AuthorizeAsync(It.IsAny<ClaimsPrincipal>(), It.IsAny<object>(), "SameUser"))
                .ReturnsAsync(AuthorizationResult.Failed());

            var controller = new SaveEGOInfoController(serviceMock.Object, authMock.Object, mapperMock.Object);

            var ex = await Assert.ThrowsAsync<ForbiddenException>(() => controller.GetSavedInfos(Guid.NewGuid(), "", 0, 10));
            Assert.Equal("You do not own this resource.", ex.Message);
            serviceMock.Verify(s => s.FindSavedInfos(It.IsAny<SearchSaveParams>()), Times.Never);
        }

        [Fact]
        public async Task GetSavedInfos_BuildsSearchSaveParams_FromQueryArgs()
        {
            var serviceMock = new Mock<ISavedInfoService<SavedEGOInfo, SavedEgo>>();
            var authMock = new Mock<IAuthorizationService>();
            var mapperMock = new Mock<IMapper>();

            var userId = Guid.NewGuid();
            authMock.Setup(a => a.AuthorizeAsync(It.IsAny<ClaimsPrincipal>(), It.IsAny<object>(), "SameUser"))
                .ReturnsAsync(AuthorizationResult.Success());

            SearchSaveParams? captured = null;
            serviceMock
                .Setup(s => s.FindSavedInfos(It.IsAny<SearchSaveParams>()))
                .Callback<SearchSaveParams>(p => captured = p)
                .ReturnsAsync([]);

            var controller = new SaveEGOInfoController(serviceMock.Object, authMock.Object, mapperMock.Object);

            await controller.GetSavedInfos(userId, "search text", 2, 5);

            Assert.NotNull(captured);
            Assert.Equal(userId, captured.UserId);
            Assert.Equal("search text", captured.Name);
            Assert.Equal(2, captured.Page);
            Assert.Equal(5, captured.Limit);
        }

        [Fact]
        public async Task GetSavedInfos_MapsEachResultItem()
        {
            var serviceMock = new Mock<ISavedInfoService<SavedEGOInfo, SavedEgo>>();
            var authMock = new Mock<IAuthorizationService>();
            var mapperMock = new Mock<IMapper>();

            var fixture = new Fixture();
            var entry1 = MockSaveData.CreateSavedEgoEntry(fixture, Guid.NewGuid(), "A");
            var entry2 = MockSaveData.CreateSavedEgoEntry(fixture, Guid.NewGuid(), "B");
            var response1 = CreateResponseDto();
            var response2 = CreateResponseDto();

            authMock.Setup(a => a.AuthorizeAsync(It.IsAny<ClaimsPrincipal>(), It.IsAny<object>(), "SameUser"))
                .ReturnsAsync(AuthorizationResult.Success());
            serviceMock.Setup(s => s.FindSavedInfos(It.IsAny<SearchSaveParams>())).ReturnsAsync([entry1, entry2]);
            mapperMock.Setup(m => m.Map<SaveInfoResponseDTO<SavedEgoRequestDTO>>(entry1)).Returns(response1);
            mapperMock.Setup(m => m.Map<SaveInfoResponseDTO<SavedEgoRequestDTO>>(entry2)).Returns(response2);

            var controller = new SaveEGOInfoController(serviceMock.Object, authMock.Object, mapperMock.Object);

            var result = await controller.GetSavedInfos(Guid.NewGuid(), "", 0, 10);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equivalent(
                ApiResponse<List<SaveInfoResponseDTO<SavedEgoRequestDTO>>>.Ok([response1, response2]),
                okResult.Value);
        }

        [Fact]
        public async Task DeleteIDSave_ThrowsNotFoundException_WhenSaveDoesNotExist()
        {
            var serviceMock = new Mock<ISavedInfoService<SavedEGOInfo, SavedEgo>>();
            var authMock = new Mock<IAuthorizationService>();
            var mapperMock = new Mock<IMapper>();

            var saveId = Guid.NewGuid();
            serviceMock.Setup(s => s.FindSavedInfoById(saveId, false)).ReturnsAsync((SavedEGOInfo?)null);

            var controller = new SaveEGOInfoController(serviceMock.Object, authMock.Object, mapperMock.Object);

            var ex = await Assert.ThrowsAsync<NotFoundException>(() => controller.DeleteIDSave(saveId));
            Assert.Equal("Save does not exist", ex.Message);
            serviceMock.Verify(s => s.DeleteSavedInfo(It.IsAny<Guid>()), Times.Never);
        }

        [Fact]
        public async Task DeleteIDSave_ThrowsForbiddenException_WhenNotAuthorized()
        {
            var serviceMock = new Mock<ISavedInfoService<SavedEGOInfo, SavedEgo>>();
            var authMock = new Mock<IAuthorizationService>();
            var mapperMock = new Mock<IMapper>();

            var fixture = new Fixture();
            var entry = MockSaveData.CreateSavedEgoEntry(fixture, Guid.NewGuid(), "Effect");

            serviceMock.Setup(s => s.FindSavedInfoById(entry.Id, false)).ReturnsAsync(entry);
            authMock.Setup(a => a.AuthorizeAsync(It.IsAny<ClaimsPrincipal>(), It.IsAny<object>(), "SameUser"))
                .ReturnsAsync(AuthorizationResult.Failed());

            var controller = new SaveEGOInfoController(serviceMock.Object, authMock.Object, mapperMock.Object);

            var ex = await Assert.ThrowsAsync<ForbiddenException>(() => controller.DeleteIDSave(entry.Id));
            Assert.Equal("You do not own this resource.", ex.Message);
            serviceMock.Verify(s => s.DeleteSavedInfo(It.IsAny<Guid>()), Times.Never);
        }

        [Fact]
        public async Task DeleteIDSave_ThrowsNotFoundException_WhenDeleteReturnsNull()
        {
            var serviceMock = new Mock<ISavedInfoService<SavedEGOInfo, SavedEgo>>();
            var authMock = new Mock<IAuthorizationService>();
            var mapperMock = new Mock<IMapper>();

            var fixture = new Fixture();
            var entry = MockSaveData.CreateSavedEgoEntry(fixture, Guid.NewGuid(), "Effect");

            serviceMock.Setup(s => s.FindSavedInfoById(entry.Id, false)).ReturnsAsync(entry);
            authMock.Setup(a => a.AuthorizeAsync(It.IsAny<ClaimsPrincipal>(), It.IsAny<object>(), "SameUser"))
                .ReturnsAsync(AuthorizationResult.Success());
            serviceMock.Setup(s => s.DeleteSavedInfo(entry.Id)).ReturnsAsync((SavedEGOInfo?)null);

            var controller = new SaveEGOInfoController(serviceMock.Object, authMock.Object, mapperMock.Object);

            var ex = await Assert.ThrowsAsync<NotFoundException>(() => controller.DeleteIDSave(entry.Id));
            Assert.Equal("Save does not exist", ex.Message);
        }

        [Fact]
        public async Task DeleteIDSave_ReturnsOk_WhenSuccessful()
        {
            var serviceMock = new Mock<ISavedInfoService<SavedEGOInfo, SavedEgo>>();
            var authMock = new Mock<IAuthorizationService>();
            var mapperMock = new Mock<IMapper>();

            var fixture = new Fixture();
            var entry = MockSaveData.CreateSavedEgoEntry(fixture, Guid.NewGuid(), "Effect");
            var responseDto = CreateResponseDto();

            serviceMock.Setup(s => s.FindSavedInfoById(entry.Id, false)).ReturnsAsync(entry);
            authMock.Setup(a => a.AuthorizeAsync(It.IsAny<ClaimsPrincipal>(), It.IsAny<object>(), "SameUser"))
                .ReturnsAsync(AuthorizationResult.Success());
            serviceMock.Setup(s => s.DeleteSavedInfo(entry.Id)).ReturnsAsync(entry);
            mapperMock.Setup(m => m.Map<SaveInfoResponseDTO<SavedEgoRequestDTO>>(entry)).Returns(responseDto);

            var controller = new SaveEGOInfoController(serviceMock.Object, authMock.Object, mapperMock.Object);

            var result = await controller.DeleteIDSave(entry.Id);

            serviceMock.Verify(s => s.DeleteSavedInfo(entry.Id), Times.Once);
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equivalent(
                ApiResponse<SaveInfoResponseDTO<SavedEgoRequestDTO>>.Ok(responseDto, "Deletion successful"),
                okResult.Value);
        }

        [Fact]
        public async Task CreateNewEGOSave_ThrowsUnauthorizedException_WhenSubClaimMissing()
        {
            var serviceMock = new Mock<ISavedInfoService<SavedEGOInfo, SavedEgo>>();
            var authMock = new Mock<IAuthorizationService>();
            var mapperMock = new Mock<IMapper>();

            var controller = new SaveEGOInfoController(serviceMock.Object, authMock.Object, mapperMock.Object);
            controller.ControllerContext.HttpContext = new DefaultHttpContext { User = CreatePrincipal(null) };

            var ex = await Assert.ThrowsAsync<UnauthorizedException>(() =>
                controller.CreateNewEGOSave(new SaveInfoFilesRequestDTO(), CreateRequestDto()));
            Assert.Equal("Invalid access token", ex.Message);
            serviceMock.Verify(s => s.CreateSavedInfo(It.IsAny<SavedEGOInfo>(), It.IsAny<SaveInfoFilesRequestDTO>()), Times.Never);
        }

        [Fact]
        public async Task CreateNewEGOSave_ThrowsUnauthorizedException_WhenSubClaimIsNotAGuid()
        {
            var serviceMock = new Mock<ISavedInfoService<SavedEGOInfo, SavedEgo>>();
            var authMock = new Mock<IAuthorizationService>();
            var mapperMock = new Mock<IMapper>();

            var controller = new SaveEGOInfoController(serviceMock.Object, authMock.Object, mapperMock.Object);
            controller.ControllerContext.HttpContext = new DefaultHttpContext { User = CreatePrincipal("not-a-guid") };

            var ex = await Assert.ThrowsAsync<UnauthorizedException>(() =>
                controller.CreateNewEGOSave(new SaveInfoFilesRequestDTO(), CreateRequestDto()));
            Assert.Equal("Invalid access token", ex.Message);
            serviceMock.Verify(s => s.CreateSavedInfo(It.IsAny<SavedEGOInfo>(), It.IsAny<SaveInfoFilesRequestDTO>()), Times.Never);
        }

        [Fact]
        public async Task CreateNewEGOSave_SetsUserIdFromToken_AndCreatesSave()
        {
            var serviceMock = new Mock<ISavedInfoService<SavedEGOInfo, SavedEgo>>();
            var authMock = new Mock<IAuthorizationService>();
            var mapperMock = new Mock<IMapper>();

            var userId = Guid.NewGuid();
            var request = CreateRequestDto();
            var files = new SaveInfoFilesRequestDTO();
            var fixture = new Fixture();
            var mappedEntity = MockSaveData.CreateSavedEgoEntry(fixture, Guid.NewGuid(), "Effect");
            var createdEntity = MockSaveData.CreateSavedEgoEntry(fixture, Guid.NewGuid(), "Created");
            var responseDto = CreateResponseDto();

            mapperMock.Setup(m => m.Map<SavedEGOInfo>(request)).Returns(mappedEntity);
            serviceMock.Setup(s => s.CreateSavedInfo(mappedEntity, files)).ReturnsAsync(createdEntity);
            mapperMock.Setup(m => m.Map<SaveInfoResponseDTO<SavedEgoRequestDTO>>(createdEntity)).Returns(responseDto);

            var controller = new SaveEGOInfoController(serviceMock.Object, authMock.Object, mapperMock.Object);
            controller.ControllerContext.HttpContext = new DefaultHttpContext { User = CreatePrincipal(userId.ToString()) };

            var result = await controller.CreateNewEGOSave(files, request);

            Assert.Equal(userId, mappedEntity.UserId);
            serviceMock.Verify(s => s.CreateSavedInfo(mappedEntity, files), Times.Once);
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equivalent(
                ApiResponse<SaveInfoResponseDTO<SavedEgoRequestDTO>>.Ok(responseDto, "New save file created successfully"),
                okResult.Value);
        }

        [Fact]
        public async Task UpdateSave_ThrowsUnauthorizedException_WhenSubClaimMissing()
        {
            var serviceMock = new Mock<ISavedInfoService<SavedEGOInfo, SavedEgo>>();
            var authMock = new Mock<IAuthorizationService>();
            var mapperMock = new Mock<IMapper>();

            var controller = new SaveEGOInfoController(serviceMock.Object, authMock.Object, mapperMock.Object);
            controller.ControllerContext.HttpContext = new DefaultHttpContext { User = CreatePrincipal(null) };

            var ex = await Assert.ThrowsAsync<UnauthorizedException>(() =>
                controller.UpdateSave(new SaveInfoFilesRequestDTO(), CreateRequestDto()));
            Assert.Equal("Invalid access token", ex.Message);
            serviceMock.Verify(s => s.UpdateSavedInfo(It.IsAny<SavedEGOInfo>(), It.IsAny<SaveInfoFilesRequestDTO>()), Times.Never);
        }

        [Fact]
        public async Task UpdateSave_ThrowsUnauthorizedException_WhenSubClaimIsNotAGuid()
        {
            var serviceMock = new Mock<ISavedInfoService<SavedEGOInfo, SavedEgo>>();
            var authMock = new Mock<IAuthorizationService>();
            var mapperMock = new Mock<IMapper>();

            var controller = new SaveEGOInfoController(serviceMock.Object, authMock.Object, mapperMock.Object);
            controller.ControllerContext.HttpContext = new DefaultHttpContext { User = CreatePrincipal("not-a-guid") };

            var ex = await Assert.ThrowsAsync<UnauthorizedException>(() =>
                controller.UpdateSave(new SaveInfoFilesRequestDTO(), CreateRequestDto()));
            Assert.Equal("Invalid access token", ex.Message);
            serviceMock.Verify(s => s.UpdateSavedInfo(It.IsAny<SavedEGOInfo>(), It.IsAny<SaveInfoFilesRequestDTO>()), Times.Never);
        }

        [Fact]
        public async Task UpdateSave_ThrowsNotFoundException_WhenSaveDoesNotExist()
        {
            var serviceMock = new Mock<ISavedInfoService<SavedEGOInfo, SavedEgo>>();
            var authMock = new Mock<IAuthorizationService>();
            var mapperMock = new Mock<IMapper>();

            var userId = Guid.NewGuid();
            var request = CreateRequestDto();
            var fixture = new Fixture();
            var mappedEntity = MockSaveData.CreateSavedEgoEntry(fixture, Guid.NewGuid(), "Effect");
            mappedEntity.Id = request.Id;

            mapperMock.Setup(m => m.Map<SavedEGOInfo>(request)).Returns(mappedEntity);
            serviceMock.Setup(s => s.FindSavedInfoById(mappedEntity.Id, false)).ReturnsAsync((SavedEGOInfo?)null);

            var controller = new SaveEGOInfoController(serviceMock.Object, authMock.Object, mapperMock.Object);
            controller.ControllerContext.HttpContext = new DefaultHttpContext { User = CreatePrincipal(userId.ToString()) };

            var ex = await Assert.ThrowsAsync<NotFoundException>(() =>
                controller.UpdateSave(new SaveInfoFilesRequestDTO(), request));
            Assert.Equal("Save does not exist", ex.Message);
            serviceMock.Verify(s => s.UpdateSavedInfo(It.IsAny<SavedEGOInfo>(), It.IsAny<SaveInfoFilesRequestDTO>()), Times.Never);
        }

        [Fact]
        public async Task UpdateSave_AuthorizesAgainstFoundEntityOwner_NotTokenUser()
        {
            var serviceMock = new Mock<ISavedInfoService<SavedEGOInfo, SavedEgo>>();
            var authMock = new Mock<IAuthorizationService>();
            var mapperMock = new Mock<IMapper>();

            var tokenUserId = Guid.NewGuid();
            var request = CreateRequestDto();
            var fixture = new Fixture();
            var mappedEntity = MockSaveData.CreateSavedEgoEntry(fixture, Guid.NewGuid(), "Effect");
            mappedEntity.Id = request.Id;
            var foundEntity = MockSaveData.CreateSavedEgoEntry(fixture, Guid.NewGuid(), "Found");

            mapperMock.Setup(m => m.Map<SavedEGOInfo>(request)).Returns(mappedEntity);
            serviceMock.Setup(s => s.FindSavedInfoById(mappedEntity.Id, false)).ReturnsAsync(foundEntity);

            object? authorizedResource = null;
            authMock
                .Setup(a => a.AuthorizeAsync(It.IsAny<ClaimsPrincipal>(), It.IsAny<object>(), "SameUser"))
                .Callback<ClaimsPrincipal, object, string>((_, resource, _) => authorizedResource = resource)
                .ReturnsAsync(AuthorizationResult.Failed());

            var controller = new SaveEGOInfoController(serviceMock.Object, authMock.Object, mapperMock.Object);
            controller.ControllerContext.HttpContext = new DefaultHttpContext { User = CreatePrincipal(tokenUserId.ToString()) };

            var ex = await Assert.ThrowsAsync<ForbiddenException>(() =>
                controller.UpdateSave(new SaveInfoFilesRequestDTO(), request));
            Assert.Equal("You do not own this resource.", ex.Message);

            var ownedResource = Assert.IsType<OwnedResource>(authorizedResource);
            Assert.Equal(foundEntity.UserId, ownedResource.UserId);
            Assert.NotEqual(tokenUserId, ownedResource.UserId);
        }

        [Fact]
        public async Task UpdateSave_ThrowsNotFoundException_WhenUpdateReturnsNull()
        {
            var serviceMock = new Mock<ISavedInfoService<SavedEGOInfo, SavedEgo>>();
            var authMock = new Mock<IAuthorizationService>();
            var mapperMock = new Mock<IMapper>();

            var userId = Guid.NewGuid();
            var request = CreateRequestDto();
            var files = new SaveInfoFilesRequestDTO();
            var fixture = new Fixture();
            var mappedEntity = MockSaveData.CreateSavedEgoEntry(fixture, Guid.NewGuid(), "Effect");
            mappedEntity.Id = request.Id;
            var foundEntity = MockSaveData.CreateSavedEgoEntry(fixture, Guid.NewGuid(), "Found");

            mapperMock.Setup(m => m.Map<SavedEGOInfo>(request)).Returns(mappedEntity);
            serviceMock.Setup(s => s.FindSavedInfoById(mappedEntity.Id, false)).ReturnsAsync(foundEntity);
            authMock.Setup(a => a.AuthorizeAsync(It.IsAny<ClaimsPrincipal>(), It.IsAny<object>(), "SameUser"))
                .ReturnsAsync(AuthorizationResult.Success());
            serviceMock.Setup(s => s.UpdateSavedInfo(mappedEntity, files)).ReturnsAsync((SavedEGOInfo?)null);

            var controller = new SaveEGOInfoController(serviceMock.Object, authMock.Object, mapperMock.Object);
            controller.ControllerContext.HttpContext = new DefaultHttpContext { User = CreatePrincipal(userId.ToString()) };

            var ex = await Assert.ThrowsAsync<NotFoundException>(() => controller.UpdateSave(files, request));
            Assert.Equal("Cannot update save", ex.Message);
        }

        [Fact]
        public async Task UpdateSave_ReturnsOk_WhenSuccessful()
        {
            var serviceMock = new Mock<ISavedInfoService<SavedEGOInfo, SavedEgo>>();
            var authMock = new Mock<IAuthorizationService>();
            var mapperMock = new Mock<IMapper>();

            var userId = Guid.NewGuid();
            var request = CreateRequestDto();
            var files = new SaveInfoFilesRequestDTO();
            var fixture = new Fixture();
            var mappedEntity = MockSaveData.CreateSavedEgoEntry(fixture, Guid.NewGuid(), "Effect");
            mappedEntity.Id = request.Id;
            var foundEntity = MockSaveData.CreateSavedEgoEntry(fixture, Guid.NewGuid(), "Found");
            var updatedEntity = MockSaveData.CreateSavedEgoEntry(fixture, Guid.NewGuid(), "Updated");
            var responseDto = CreateResponseDto();

            mapperMock.Setup(m => m.Map<SavedEGOInfo>(request)).Returns(mappedEntity);
            serviceMock.Setup(s => s.FindSavedInfoById(mappedEntity.Id, false)).ReturnsAsync(foundEntity);
            authMock.Setup(a => a.AuthorizeAsync(It.IsAny<ClaimsPrincipal>(), It.IsAny<object>(), "SameUser"))
                .ReturnsAsync(AuthorizationResult.Success());
            serviceMock.Setup(s => s.UpdateSavedInfo(mappedEntity, files)).ReturnsAsync(updatedEntity);
            mapperMock.Setup(m => m.Map<SaveInfoResponseDTO<SavedEgoRequestDTO>>(updatedEntity)).Returns(responseDto);

            var controller = new SaveEGOInfoController(serviceMock.Object, authMock.Object, mapperMock.Object);
            controller.ControllerContext.HttpContext = new DefaultHttpContext { User = CreatePrincipal(userId.ToString()) };

            var result = await controller.UpdateSave(files, request);

            serviceMock.Verify(s => s.UpdateSavedInfo(mappedEntity, files), Times.Once);
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equivalent(
                ApiResponse<SaveInfoResponseDTO<SavedEgoRequestDTO>>.Ok(responseDto, "Save has been updated"),
                okResult.Value);
        }
    }
}
