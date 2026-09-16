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
        public async Task ShouldFindSavedInfos_ComputesSkipAndTakeAndReturnsCorrectPage()
        {
            var fixture = new Fixture();
            var userId = Guid.NewGuid();

            var entries = Enumerable.Range(0, 6)
                .Select(i =>
                {
                    var entry = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");
                    entry.UserId = userId;
                    entry.SaveTime = new DateTime(2024, 1, 1).AddDays(i);
                    return entry;
                })
                .ToList();

            var saveInfoRepository = new Mock<ISaveInfoRepository<SavedIDInfo, SavedId>>();
            var savedSkillRepository = new Mock<ISavedSkillRepository>();
            SetupFindAsync(saveInfoRepository, entries);

            var service = new SavedInfoService<SavedIDInfo, SavedId>(saveInfoRepository.Object, savedSkillRepository.Object);

            var result = await service.FindSavedInfos(new SearchSaveParams { UserId = userId, Page = 1, Limit = 2 });

            Assert.Equal(2, result.Count);
            Assert.Equal(entries[3].Id, result[0].Id);
            Assert.Equal(entries[2].Id, result[1].Id);
        }

        [Fact]
        public async Task ShouldFindSavedInfos_FiltersByNameAndUserIdAndOrdersBySaveTimeDescending()
        {
            var fixture = new Fixture();
            var userId = Guid.NewGuid();

            var matchingOld = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");
            matchingOld.UserId = userId;
            matchingOld.Name = "Ishmael Build";
            matchingOld.SaveTime = new DateTime(2020, 1, 1);

            var matchingNew = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");
            matchingNew.UserId = userId;
            matchingNew.Name = "Ishmael Reforged";
            matchingNew.SaveTime = new DateTime(2022, 1, 1);

            var wrongName = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");
            wrongName.UserId = userId;
            wrongName.Name = "Something Else";
            wrongName.SaveTime = new DateTime(2021, 1, 1);

            var wrongUser = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");
            wrongUser.UserId = Guid.NewGuid();
            wrongUser.Name = "Ishmael Build";
            wrongUser.SaveTime = new DateTime(2023, 1, 1);

            var saveInfoRepository = new Mock<ISaveInfoRepository<SavedIDInfo, SavedId>>();
            var savedSkillRepository = new Mock<ISavedSkillRepository>();
            SetupFindAsync(saveInfoRepository, [matchingOld, matchingNew, wrongName, wrongUser]);

            var service = new SavedInfoService<SavedIDInfo, SavedId>(saveInfoRepository.Object, savedSkillRepository.Object);

            var result = await service.FindSavedInfos(new SearchSaveParams { Name = "Ish", UserId = userId });

            Assert.Equal([matchingNew.Id, matchingOld.Id], result.Select(r => r.Id));
        }

        [Fact]
        public async Task ShouldFindSavedInfos_WithDefaultOptions_ReturnsAllSavesForUserOnFirstPage()
        {
            var fixture = new Fixture();
            var userId = Guid.NewGuid();

            var save1 = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");
            save1.UserId = userId;
            save1.Name = "Alpha Build";
            var save2 = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");
            save2.UserId = userId;
            save2.Name = "Beta Build";
            var save3 = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");
            save3.UserId = userId;
            save3.Name = "Gamma Build";

            var saveInfoRepository = new Mock<ISaveInfoRepository<SavedIDInfo, SavedId>>();
            var savedSkillRepository = new Mock<ISavedSkillRepository>();
            SetupFindAsync(saveInfoRepository, [save1, save2, save3]);

            var service = new SavedInfoService<SavedIDInfo, SavedId>(saveInfoRepository.Object, savedSkillRepository.Object);

            var result = await service.FindSavedInfos(new SearchSaveParams { UserId = userId });

            Assert.Equal(3, result.Count);
            Assert.Contains(result, s => s.Id == save1.Id);
            Assert.Contains(result, s => s.Id == save2.Id);
            Assert.Contains(result, s => s.Id == save3.Id);
        }

        [Fact]
        public async Task ShouldFindSavedInfos_WithUserId_OnlyReturnsSavesForThatUser()
        {
            var fixture = new Fixture();
            var targetUserId = Guid.NewGuid();
            var otherUserId = Guid.NewGuid();

            var ownSave1 = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");
            ownSave1.UserId = targetUserId;
            var ownSave2 = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");
            ownSave2.UserId = targetUserId;
            var otherUserSave = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Effect");
            otherUserSave.UserId = otherUserId;

            var saveInfoRepository = new Mock<ISaveInfoRepository<SavedIDInfo, SavedId>>();
            var savedSkillRepository = new Mock<ISavedSkillRepository>();
            SetupFindAsync(saveInfoRepository, [ownSave1, ownSave2, otherUserSave]);

            var service = new SavedInfoService<SavedIDInfo, SavedId>(saveInfoRepository.Object, savedSkillRepository.Object);

            var result = await service.FindSavedInfos(new SearchSaveParams { UserId = targetUserId });

            Assert.Equal(2, result.Count);
            Assert.All(result, s => Assert.Equal(targetUserId, s.UserId));
            Assert.DoesNotContain(result, s => s.Id == otherUserSave.Id);
        }

        private static void SetupFindAsync(
            Mock<ISaveInfoRepository<SavedIDInfo, SavedId>> repository,
            List<SavedIDInfo> allEntries)
        {
            repository
                .Setup(r => r.FindAsync(It.IsAny<RepositoryGetParams<SavedIDInfo>>()))
                .Returns((RepositoryGetParams<SavedIDInfo> p) =>
                {
                    IQueryable<SavedIDInfo> query = allEntries.AsQueryable();
                    if (p.Filter != null) query = query.Where(p.Filter);
                    if (p.OrderBy != null) query = p.OrderBy(query);
                    return Task.FromResult(query.Skip(p.Skip).Take(p.Take).AsEnumerable());
                });
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
