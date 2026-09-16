using AutoFixture;
using Moq;
using Server.Features.SaveInfo.Repository;
using Server.Features.SaveInfo.Service;
using Server.Shared.Http;
using Server.Shared.Model;

namespace Server.Tests.Features.SaveInfo.Service
{
    public class SaveInfoServiceTest
    {
        [Fact]
        public async Task ShouldCreateSaveInfo_AndConvertAllFilesToBase64()
        {
            var fixture = new Fixture();
            var skillId = Guid.NewGuid();

            var offenseSkills = MockSaveData.CreateOffenseSkills(fixture, 0, 1);
            var defenseSkills = MockSaveData.CreateDefenseSkills(fixture, 2);
            var customEffects = MockSaveData.CreateCustomEffects(fixture, 3);

            var untouchedOffenseSkill = offenseSkills.Single(s => s.Index == 1);
            var untouchedOffenseSkillOriginalUrl = untouchedOffenseSkill.ImageAttach.Url;

            var entry = MockSaveData.CreateSavedIdEntry(
                fixture, skillId, "Effect",
                offenseSkills: offenseSkills,
                defenseSkills: defenseSkills,
                customEffects: customEffects);

            var thumbnailBytes = "thumb"u8.ToArray();
            var splashArtBytes = "splash"u8.ToArray();
            var sinnerIconBytes = "sinner"u8.ToArray();
            var offenseBytes = "offense-0"u8.ToArray();
            var defenseBytes = "defense-2"u8.ToArray();
            var customBytes = "custom-3"u8.ToArray();

            var files = MockSaveData.CreateSaveInfoFilesRequestDTO(
                thumbnailBytes, splashArtBytes, sinnerIconBytes,
                skillImages:
                [
                    (0, offenseBytes),
                    (2, defenseBytes),
                    (3, customBytes),
                ]);

            var saveInfoRepository = new Mock<ISaveInfoRepository<SavedIDInfo, SavedId>>();
            var savedSkillRepository = new Mock<ISavedSkillRepository>();

            var expectedReturn = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Returned");

            saveInfoRepository.Setup(r => r.AddAsync(It.IsAny<SavedIDInfo>())).ReturnsAsync(expectedReturn);
            saveInfoRepository.Setup(r => r.SaveChangeAsync()).Returns(Task.CompletedTask);

            var service = new SavedInfoService<SavedIDInfo, SavedId>(saveInfoRepository.Object, savedSkillRepository.Object);

            var result = await service.CreateSavedInfo(entry, files);

            Assert.Same(expectedReturn, result);
            saveInfoRepository.Verify(r => r.AddAsync(entry), Times.Once);
            saveInfoRepository.Verify(r => r.SaveChangeAsync(), Times.Once);

            Assert.Equal("data:image/png;base64," + Convert.ToBase64String(thumbnailBytes), entry.ImageAttach.Url);
            Assert.Equal("data:image/png;base64," + Convert.ToBase64String(splashArtBytes), entry.Saved.SplashArt.Url);
            Assert.Equal("data:image/png;base64," + Convert.ToBase64String(sinnerIconBytes), entry.Saved.SinnerIcon.Url);

            Assert.Equal(
                "data:image/png;base64," + Convert.ToBase64String(offenseBytes),
                entry.Saved.Skill.OffenseSkills.Single(s => s.Index == 0).ImageAttach.Url);
            Assert.Equal(
                "data:image/png;base64," + Convert.ToBase64String(defenseBytes),
                entry.Saved.Skill.DefenseSkills.Single(s => s.Index == 2).ImageAttach.Url);
            Assert.Equal(
                "data:image/png;base64," + Convert.ToBase64String(customBytes),
                entry.Saved.Skill.CustomEffects.Single(s => s.Index == 3).ImageAttach.Url);

            Assert.Equal(
                untouchedOffenseSkillOriginalUrl,
                entry.Saved.Skill.OffenseSkills.Single(s => s.Index == 1).ImageAttach.Url);
        }

        [Fact]
        public async Task ShouldDeleteSavedInfo_WhenFound()
        {
            var fixture = new Fixture();
            var entry = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");

            var saveInfoRepository = new Mock<ISaveInfoRepository<SavedIDInfo, SavedId>>();
            var savedSkillRepository = new Mock<ISavedSkillRepository>();

            saveInfoRepository.Setup(r => r.GetByIdAsync(entry.Id)).ReturnsAsync(entry);
            saveInfoRepository.Setup(r => r.RemoveAsync(entry)).Returns(Task.CompletedTask);
            saveInfoRepository.Setup(r => r.SaveChangeAsync()).Returns(Task.CompletedTask);

            var service = new SavedInfoService<SavedIDInfo, SavedId>(saveInfoRepository.Object, savedSkillRepository.Object);

            var result = await service.DeleteSavedInfo(entry.Id);

            Assert.Same(entry, result);
            saveInfoRepository.Verify(r => r.RemoveAsync(entry), Times.Once);
            saveInfoRepository.Verify(r => r.SaveChangeAsync(), Times.Once);
        }

        [Fact]
        public async Task ShouldNotDeleteSavedInfo_WhenNotFound()
        {
            var id = Guid.NewGuid();

            var saveInfoRepository = new Mock<ISaveInfoRepository<SavedIDInfo, SavedId>>();
            var savedSkillRepository = new Mock<ISavedSkillRepository>();

            saveInfoRepository.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((SavedIDInfo?)null);

            var service = new SavedInfoService<SavedIDInfo, SavedId>(saveInfoRepository.Object, savedSkillRepository.Object);

            var result = await service.DeleteSavedInfo(id);

            Assert.Null(result);
            saveInfoRepository.Verify(r => r.RemoveAsync(It.IsAny<SavedIDInfo>()), Times.Never);
            saveInfoRepository.Verify(r => r.SaveChangeAsync(), Times.Never);
        }

        [Fact]
        public async Task ShouldFindSavedInfoById_WithoutIncludeSkill_CallsGetByIdAsync()
        {
            var fixture = new Fixture();
            var entry = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");

            var saveInfoRepository = new Mock<ISaveInfoRepository<SavedIDInfo, SavedId>>();
            var savedSkillRepository = new Mock<ISavedSkillRepository>();

            saveInfoRepository.Setup(r => r.GetByIdAsync(entry.Id)).ReturnsAsync(entry);

            var service = new SavedInfoService<SavedIDInfo, SavedId>(saveInfoRepository.Object, savedSkillRepository.Object);

            var result = await service.FindSavedInfoById(entry.Id);

            Assert.Same(entry, result);
            saveInfoRepository.Verify(r => r.GetByIdAsync(entry.Id), Times.Once);
            saveInfoRepository.Verify(r => r.GetByIdAsyncIncludingSaved(It.IsAny<Guid>()), Times.Never);
        }

        [Fact]
        public async Task ShouldFindSavedInfoById_WithIncludeSkill_CallsGetByIdAsyncIncludingSaved()
        {
            var fixture = new Fixture();
            var entry = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");

            var saveInfoRepository = new Mock<ISaveInfoRepository<SavedIDInfo, SavedId>>();
            var savedSkillRepository = new Mock<ISavedSkillRepository>();

            saveInfoRepository.Setup(r => r.GetByIdAsyncIncludingSaved(entry.Id)).ReturnsAsync(entry);

            var service = new SavedInfoService<SavedIDInfo, SavedId>(saveInfoRepository.Object, savedSkillRepository.Object);

            var result = await service.FindSavedInfoById(entry.Id, includeSkill: true);

            Assert.Same(entry, result);
            saveInfoRepository.Verify(r => r.GetByIdAsyncIncludingSaved(entry.Id), Times.Once);
            saveInfoRepository.Verify(r => r.GetByIdAsync(It.IsAny<Guid>()), Times.Never);
        }

        [Fact]
        public async Task ShouldFindSavedInfos_ComputesSkipAndTakeAndReturnsRepositoryResults()
        {
            var fixture = new Fixture();
            var expectedResults = new List<SavedIDInfo>
            {
                MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "A"),
                MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "B"),
            };

            RepositoryGetParams<SavedIDInfo>? captured = null;

            var saveInfoRepository = new Mock<ISaveInfoRepository<SavedIDInfo, SavedId>>();
            var savedSkillRepository = new Mock<ISavedSkillRepository>();

            saveInfoRepository
                .Setup(r => r.FindAsync(It.IsAny<RepositoryGetParams<SavedIDInfo>>()))
                .Callback<RepositoryGetParams<SavedIDInfo>>(p => captured = p)
                .ReturnsAsync(expectedResults);

            var service = new SavedInfoService<SavedIDInfo, SavedId>(saveInfoRepository.Object, savedSkillRepository.Object);

            var option = new SearchSaveParams { Name = "x", UserId = Guid.NewGuid(), Page = 2, Limit = 5 };

            var result = await service.FindSavedInfos(option);

            Assert.NotNull(captured);
            Assert.Equal(10, captured.Skip);
            Assert.Equal(5, captured.Take);
            Assert.Equal(expectedResults, result);
        }

        [Fact]
        public async Task ShouldFindSavedInfos_FiltersByNameAndUserIdAndOrdersBySaveTimeDescending()
        {
            var fixture = new Fixture();
            var userId = Guid.NewGuid();

            RepositoryGetParams<SavedIDInfo>? captured = null;

            var saveInfoRepository = new Mock<ISaveInfoRepository<SavedIDInfo, SavedId>>();
            var savedSkillRepository = new Mock<ISavedSkillRepository>();

            saveInfoRepository
                .Setup(r => r.FindAsync(It.IsAny<RepositoryGetParams<SavedIDInfo>>()))
                .Callback<RepositoryGetParams<SavedIDInfo>>(p => captured = p)
                .ReturnsAsync([]);

            var service = new SavedInfoService<SavedIDInfo, SavedId>(saveInfoRepository.Object, savedSkillRepository.Object);

            await service.FindSavedInfos(new SearchSaveParams { Name = "Ish", UserId = userId });

            Assert.NotNull(captured);
            var filter = captured.Filter!.Compile();

            var matching = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");
            matching.Name = "Ishmael Build";
            matching.UserId = userId;
            Assert.True(filter(matching));

            var wrongName = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");
            wrongName.Name = "Something Else";
            wrongName.UserId = userId;
            Assert.False(filter(wrongName));

            var wrongUser = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");
            wrongUser.Name = "Ishmael Build";
            wrongUser.UserId = Guid.NewGuid();
            Assert.False(filter(wrongUser));

            var oldest = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");
            oldest.SaveTime = new DateTime(2020, 1, 1);
            var middle = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");
            middle.SaveTime = new DateTime(2021, 1, 1);
            var newest = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");
            newest.SaveTime = new DateTime(2022, 1, 1);

            var ordered = captured.OrderBy!(new List<SavedIDInfo> { oldest, newest, middle }.AsQueryable()).ToList();

            Assert.Equal([newest, middle, oldest], ordered);
        }

        [Fact]
        public async Task ShouldReturnNull_WhenOldSaveNotFound()
        {
            var fixture = new Fixture();
            var newSave = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");

            var saveInfoRepository = new Mock<ISaveInfoRepository<SavedIDInfo, SavedId>>();
            var savedSkillRepository = new Mock<ISavedSkillRepository>();

            saveInfoRepository.Setup(r => r.GetByIdAsyncIncludingSaved(newSave.Id)).ReturnsAsync((SavedIDInfo?)null);

            var service = new SavedInfoService<SavedIDInfo, SavedId>(saveInfoRepository.Object, savedSkillRepository.Object);

            var result = await service.UpdateSavedInfo(newSave, MockSaveData.CreateSaveInfoFilesRequestDTO());

            Assert.Null(result);
            saveInfoRepository.Verify(r => r.MergeSavedInfo(It.IsAny<SavedIDInfo>(), It.IsAny<SavedIDInfo>()), Times.Never);
            savedSkillRepository.Verify(r => r.UpdateSavedSkill(It.IsAny<SavedSkill>(), It.IsAny<SavedSkill>()), Times.Never);
            saveInfoRepository.Verify(r => r.SaveChangeAsync(), Times.Never);
        }

        [Fact]
        public async Task ShouldReturnNull_WhenOldSavedIsNull()
        {
            var fixture = new Fixture();
            var oldSave = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");
            oldSave.Saved = null!;

            var newSave = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");
            newSave.Id = oldSave.Id;
            newSave.UserId = oldSave.UserId;

            var saveInfoRepository = new Mock<ISaveInfoRepository<SavedIDInfo, SavedId>>();
            var savedSkillRepository = new Mock<ISavedSkillRepository>();

            saveInfoRepository.Setup(r => r.GetByIdAsyncIncludingSaved(newSave.Id)).ReturnsAsync(oldSave);

            var service = new SavedInfoService<SavedIDInfo, SavedId>(saveInfoRepository.Object, savedSkillRepository.Object);

            var result = await service.UpdateSavedInfo(newSave, MockSaveData.CreateSaveInfoFilesRequestDTO());

            Assert.Null(result);
            saveInfoRepository.Verify(r => r.MergeSavedInfo(It.IsAny<SavedIDInfo>(), It.IsAny<SavedIDInfo>()), Times.Never);
            savedSkillRepository.Verify(r => r.UpdateSavedSkill(It.IsAny<SavedSkill>(), It.IsAny<SavedSkill>()), Times.Never);
            saveInfoRepository.Verify(r => r.SaveChangeAsync(), Times.Never);
        }

        [Fact]
        public async Task ShouldReturnNull_WhenOwnershipMismatch()
        {
            var fixture = new Fixture();
            var oldSave = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");

            var newSave = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");
            newSave.Id = oldSave.Id;

            var saveInfoRepository = new Mock<ISaveInfoRepository<SavedIDInfo, SavedId>>();
            var savedSkillRepository = new Mock<ISavedSkillRepository>();

            saveInfoRepository.Setup(r => r.GetByIdAsyncIncludingSaved(newSave.Id)).ReturnsAsync(oldSave);

            var service = new SavedInfoService<SavedIDInfo, SavedId>(saveInfoRepository.Object, savedSkillRepository.Object);

            var result = await service.UpdateSavedInfo(newSave, MockSaveData.CreateSaveInfoFilesRequestDTO());

            Assert.Null(result);
            saveInfoRepository.Verify(r => r.MergeSavedInfo(It.IsAny<SavedIDInfo>(), It.IsAny<SavedIDInfo>()), Times.Never);
            savedSkillRepository.Verify(r => r.UpdateSavedSkill(It.IsAny<SavedSkill>(), It.IsAny<SavedSkill>()), Times.Never);
            saveInfoRepository.Verify(r => r.SaveChangeAsync(), Times.Never);
        }

        [Fact]
        public async Task ShouldUpdateSavedInfo_AndTransferImageIdsAndReconcileSkillImageIds()
        {
            var fixture = new Fixture();
            var matchedSkillId = Guid.NewGuid();

            var oldOffenseSkills = MockSaveData.CreateOffenseSkills(fixture, 0);
            oldOffenseSkills[0].Id = matchedSkillId;

            var oldSave = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect", offenseSkills: oldOffenseSkills);

            var matchedNewSkill = MockSaveData.CreateOffenseSkills(fixture, 0)[0];
            matchedNewSkill.Id = matchedSkillId;
            var unmatchedNewSkill = MockSaveData.CreateOffenseSkills(fixture, 1)[0];
            var unmatchedNewSkillOriginalImageId = unmatchedNewSkill.ImageAttach.Id;

            var newSave = MockSaveData.CreateSavedIdEntry(
                fixture, Guid.NewGuid(), "Effect",
                offenseSkills: [matchedNewSkill, unmatchedNewSkill]);
            newSave.Id = oldSave.Id;
            newSave.UserId = oldSave.UserId;

            var saveInfoRepository = new Mock<ISaveInfoRepository<SavedIDInfo, SavedId>>();
            var savedSkillRepository = new Mock<ISavedSkillRepository>();

            saveInfoRepository.Setup(r => r.GetByIdAsyncIncludingSaved(newSave.Id)).ReturnsAsync(oldSave);
            saveInfoRepository.Setup(r => r.MergeSavedInfo(oldSave, newSave)).Returns(Task.CompletedTask);
            savedSkillRepository
                .Setup(r => r.UpdateSavedSkill(oldSave.Saved.Skill, newSave.Saved.Skill))
                .ReturnsAsync(oldSave.Saved.Skill);
            saveInfoRepository.Setup(r => r.SaveChangeAsync()).Returns(Task.CompletedTask);

            var service = new SavedInfoService<SavedIDInfo, SavedId>(saveInfoRepository.Object, savedSkillRepository.Object);

            var result = await service.UpdateSavedInfo(newSave, MockSaveData.CreateSaveInfoFilesRequestDTO());

            Assert.Same(oldSave, result);
            saveInfoRepository.Verify(r => r.MergeSavedInfo(oldSave, newSave), Times.Once);
            savedSkillRepository.Verify(r => r.UpdateSavedSkill(oldSave.Saved.Skill, newSave.Saved.Skill), Times.Once);
            saveInfoRepository.Verify(r => r.SaveChangeAsync(), Times.Once);

            Assert.Equal(oldSave.ImageAttach.Id, newSave.ImageAttach.Id);
            Assert.Equal(oldSave.Saved.SplashArt.Id, newSave.Saved.SplashArt.Id);
            Assert.Equal(oldSave.Saved.SplashArt.Id, newSave.Saved.SplashArtId);
            Assert.Equal(oldSave.Saved.SinnerIcon.Id, newSave.Saved.SinnerIcon.Id);
            Assert.Equal(oldSave.Saved.SinnerIcon.Id, newSave.Saved.SinnerIconId);

            var oldMatchedSkill = oldSave.Saved.Skill.OffenseSkills.Single(s => s.Id == matchedSkillId);
            Assert.Equal(oldMatchedSkill.ImageAttach.Id, matchedNewSkill.ImageAttach.Id);
            Assert.Equal(oldMatchedSkill.ImageAttachId, matchedNewSkill.ImageAttachId);

            Assert.Equal(unmatchedNewSkillOriginalImageId, unmatchedNewSkill.ImageAttach.Id);
        }
    }
}
