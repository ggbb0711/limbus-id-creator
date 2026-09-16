using AutoFixture;
using Microsoft.AspNetCore.Http;
using Moq;
using Server.Features.SaveInfo.DTO;
using Server.Shared.Model;

namespace Server.Tests.Features.SaveInfo
{
    public class MockSaveData
    {
        public static SavedIDInfo CreateSavedIdEntry(
            Fixture fixture, Guid skillId, string mentalEffectText,
            List<OffenseSkill>? offenseSkills = null,
            List<DefenseSkill>? defenseSkills = null,
            List<PassiveSkill>? passiveSkills = null,
            List<CustomEffect>? customEffects = null)
        {
            var entryId = Guid.NewGuid();

            var skill = new SavedSkill
            {
                Id = skillId,
                OffenseSkills = offenseSkills ?? [],
                DefenseSkills = defenseSkills ?? [],
                PassiveSkills = passiveSkills ?? [],
                CustomEffects = customEffects ?? [],
                MentalEffects =
                [
                    fixture.Build<MentalEffect>()
                        .With(x => x.SavedSkillId, skillId)
                        .With(x => x.Effect, mentalEffectText)
                        .Create(),
                ],
            };

            var saved = fixture.Build<SavedId>()
                .Without(x => x.SplashArt)
                .Without(x => x.SinnerIcon)
                .Without(x => x.Skill)
                .Create();
            saved.Id = entryId;
            saved.SplashArt = fixture.Create<ImageObj>();
            saved.SinnerIcon = fixture.Create<ImageObj>();
            saved.SavedSkillId = skillId;
            saved.Skill = skill;

            var entry = fixture.Build<SavedIDInfo>()
                .Without(x => x.ImageAttach)
                .Without(x => x.User)
                .Without(x => x.Saved)
                .Create();
            entry.Id = entryId;
            entry.ImageAttach = fixture.Create<ImageObj>();
            entry.Saved = saved;

            return entry;
        }

        public static SavedEGOInfo CreateSavedEgoEntry(
            Fixture fixture, Guid skillId, string mentalEffectText,
            List<OffenseSkill>? offenseSkills = null,
            List<DefenseSkill>? defenseSkills = null,
            List<PassiveSkill>? passiveSkills = null,
            List<CustomEffect>? customEffects = null)
        {
            var entryId = Guid.NewGuid();

            var skill = new SavedSkill
            {
                Id = skillId,
                OffenseSkills = offenseSkills ?? [],
                DefenseSkills = defenseSkills ?? [],
                PassiveSkills = passiveSkills ?? [],
                CustomEffects = customEffects ?? [],
                MentalEffects =
                [
                    fixture.Build<MentalEffect>()
                        .With(x => x.SavedSkillId, skillId)
                        .With(x => x.Effect, mentalEffectText)
                        .Create(),
                ],
            };

            var saved = fixture.Build<SavedEgo>()
                .Without(x => x.SplashArt)
                .Without(x => x.SinnerIcon)
                .Without(x => x.Skill)
                .Create();
            saved.Id = entryId;
            saved.SplashArt = fixture.Create<ImageObj>();
            saved.SinnerIcon = fixture.Create<ImageObj>();
            saved.SavedSkillId = skillId;
            saved.Skill = skill;

            var entry = fixture.Build<SavedEGOInfo>()
                .Without(x => x.ImageAttach)
                .Without(x => x.User)
                .Without(x => x.Saved)
                .Create();
            entry.Id = entryId;
            entry.ImageAttach = fixture.Create<ImageObj>();
            entry.Saved = saved;

            return entry;
        }

        public static List<OffenseSkill> CreateOffenseSkills(Fixture fixture, params int[] indices) =>
            [.. indices.Select(index =>
            {
                var skill = fixture.Build<OffenseSkill>()
                    .With(x => x.Index, index)
                    .Without(x => x.ImageAttach)
                    .Create();
                skill.ImageAttach = fixture.Create<ImageObj>();
                return skill;
            })];

        public static List<DefenseSkill> CreateDefenseSkills(Fixture fixture, params int[] indices) =>
            [.. indices.Select(index =>
            {
                var skill = fixture.Build<DefenseSkill>()
                    .With(x => x.Index, index)
                    .Without(x => x.ImageAttach)
                    .Create();
                skill.ImageAttach = fixture.Create<ImageObj>();
                return skill;
            })];

        public static List<CustomEffect> CreateCustomEffects(Fixture fixture, params int[] indices) =>
            [.. indices.Select(index =>
            {
                var skill = fixture.Build<CustomEffect>()
                    .With(x => x.Index, index)
                    .Without(x => x.ImageAttach)
                    .Create();
                skill.ImageAttach = fixture.Create<ImageObj>();
                return skill;
            })];

        public static List<PassiveSkill> CreatePassiveSkills(Fixture fixture, params int[] indices) =>
            [.. indices.Select(index => fixture.Build<PassiveSkill>().With(x => x.Index, index).Create())];

        public static Mock<IFormFile> CreateFakeFormFile(byte[] content)
        {
            var file = new Mock<IFormFile>();
            file.Setup(f => f.Length).Returns(content.Length);
            file.Setup(f => f.CopyToAsync(It.IsAny<Stream>(), It.IsAny<CancellationToken>()))
                .Returns((Stream target, CancellationToken token) => target.WriteAsync(content, 0, content.Length, token));
            return file;
        }

        public static SaveInfoFilesRequestDTO CreateSaveInfoFilesRequestDTO(
            byte[]? thumbnailBytes = null,
            byte[]? splashArtBytes = null,
            byte[]? sinnerIconBytes = null,
            List<(int Index, byte[] Bytes)>? skillImages = null)
        {
            var dto = new SaveInfoFilesRequestDTO();

            if (thumbnailBytes != null) dto.ThumbnailImage = CreateFakeFormFile(thumbnailBytes).Object;
            if (splashArtBytes != null) dto.SplashArtImg = CreateFakeFormFile(splashArtBytes).Object;
            if (sinnerIconBytes != null) dto.SinnerIcon = CreateFakeFormFile(sinnerIconBytes).Object;

            if (skillImages != null)
            {
                dto.SkillImages =
                [
                    .. skillImages.Select(s => new SkillImageEntry
                    {
                        Image = CreateFakeFormFile(s.Bytes).Object,
                        Index = s.Index,
                    }),
                ];
            }

            return dto;
        }
    }
}
