using System.Text.Json;
using AutoFixture;
using AutoMapper;
using Moq;
using Server.Features.Images.Enum;
using Server.Features.Post.DTO;
using Server.Features.Post.Service;
using Server.Features.SaveInfo.DTO;
using Server.Features.SaveInfo.Service;
using Server.Shared.Exception;
using Server.Shared.Model;

namespace Server.Tests.Features.Post.Service
{
    public class PostCardBuilderTest
    {
        private readonly Fixture _fixture = new();
        private readonly IMapper _mapper = new MapperConfiguration(cfg => cfg.AddProfile<SaveInfoProfile>()).CreateMapper();
        private readonly Mock<ISavedInfoService<SavedIDInfo, SavedId>> _idSaves = new();
        private readonly Mock<ISavedInfoService<SavedEGOInfo, SavedEgo>> _egoSaves = new();

        private PostCardBuilder CreateBuilder() => new(_idSaves.Object, _egoSaves.Object, _mapper);

        [Fact]
        public async Task BuildAsync_CopiesEachSaveInRequestOrder()
        {
            var userId = Guid.NewGuid();
            var id = PostCardTestData.IdSave(_fixture, userId, "https://cdn.test/id-preview.png");
            var ego = PostCardTestData.EgoSave(_fixture, userId, "https://cdn.test/ego-preview.png");
            _idSaves.Setup(s => s.FindSavedInfoById(id.Id, true)).ReturnsAsync(id);
            _egoSaves.Setup(s => s.FindSavedInfoById(ego.Id, true)).ReturnsAsync(ego);

            var cards = await CreateBuilder().BuildAsync(userId,
            [
                new PostCardRequestDTO { SaveId = ego.Id, Kind = PostCardKind.Ego },
                new PostCardRequestDTO { SaveId = id.Id, Kind = PostCardKind.Identity },
            ]);

            Assert.Equal([0, 1], cards.Select(c => c.Position));
            Assert.Equal([PostCardKind.Ego, PostCardKind.Identity], cards.Select(c => c.Kind));
            Assert.Equal([ego.Id, id.Id], cards.Select(c => c.SaveId!.Value));
            Assert.Equal(["https://cdn.test/ego-preview.png", "https://cdn.test/id-preview.png"], cards.Select(c => c.ImageUrl));

            var idJson = JsonDocument.Parse(cards[1].SaveInfo).RootElement;
            Assert.Equal(id.Saved.Name, idJson.GetProperty("name").GetString());
            var skills = idJson.GetProperty("skillDetails").EnumerateArray().ToList();
            Assert.Contains(skills, s => s.GetProperty("type").GetString() == "OffenseSkill");
            Assert.Contains(skills, s => s.GetProperty("type").GetString() == "PassiveSkill");
            Assert.Contains(skills, s => s.GetProperty("type").GetString() == "MentalEffect");
        }

        [Fact]
        public async Task BuildAsync_ThrowsNotFound_WhenSaveMissing()
        {
            _idSaves.Setup(s => s.FindSavedInfoById(It.IsAny<Guid>(), true)).ReturnsAsync((SavedIDInfo?)null);

            await Assert.ThrowsAsync<NotFoundException>(() => CreateBuilder().BuildAsync(Guid.NewGuid(),
                [new PostCardRequestDTO { SaveId = Guid.NewGuid(), Kind = PostCardKind.Identity }]));
        }

        [Fact]
        public async Task BuildAsync_ThrowsForbidden_WhenSaveBelongsToAnotherUser()
        {
            var save = PostCardTestData.IdSave(_fixture, Guid.NewGuid(), "https://cdn.test/p.png");
            _idSaves.Setup(s => s.FindSavedInfoById(save.Id, true)).ReturnsAsync(save);

            await Assert.ThrowsAsync<ForbiddenException>(() => CreateBuilder().BuildAsync(Guid.NewGuid(),
                [new PostCardRequestDTO { SaveId = save.Id, Kind = PostCardKind.Identity }]));
        }

        [Fact]
        public async Task BuildAsync_ThrowsConflict_WhenAnImageIsStillPending()
        {
            var userId = Guid.NewGuid();
            var save = PostCardTestData.IdSave(_fixture, userId, "https://cdn.test/p.png");
            save.Saved.SplashArt.Status = AssetStatus.Pending;
            _idSaves.Setup(s => s.FindSavedInfoById(save.Id, true)).ReturnsAsync(save);

            var error = await Assert.ThrowsAsync<ConflictException>(() => CreateBuilder().BuildAsync(userId,
                [new PostCardRequestDTO { SaveId = save.Id, Kind = PostCardKind.Identity }]));
            Assert.Equal(ApiErrors.SaveImagesPending.Code, error.ErrorCode);
        }

        [Fact]
        public void FromIdentity_ThrowsConflict_WhenAnImageIsStillBase64()
        {
            var save = PostCardTestData.IdSave(_fixture, Guid.NewGuid(), "https://cdn.test/p.png");
            save.Saved.Skill.OffenseSkills.First().ImageAttach.Url = "data:image/png;base64," + Convert.ToBase64String(new byte[12]);

            Assert.Throws<ConflictException>(() => CreateBuilder().FromIdentity(save, 0));
        }
    }
}
