using AutoFixture;
using Server.Features.Images.Enum;
using Server.Features.SaveInfo.Enum;
using Server.Shared.Model;
using Server.Shared.Model.Interface;
using Server.Tests.Features.SaveInfo;

namespace Server.Tests.Features.Post
{
    public static class PostCardTestData
    {
        public static SavedIDInfo IdSave(Fixture fixture, Guid userId, string previewUrl)
        {
            var save = MockSaveData.CreateSavedIdEntry(fixture, Guid.NewGuid(), "Mental text",
                offenseSkills: MockSaveData.CreateOffenseSkills(fixture, 0),
                passiveSkills: MockSaveData.CreatePassiveSkills(fixture, 1));
            Prepare(save, userId, previewUrl);
            return save;
        }

        public static SavedEGOInfo EgoSave(Fixture fixture, Guid userId, string previewUrl)
        {
            var save = MockSaveData.CreateSavedEgoEntry(fixture, Guid.NewGuid(), "Mental text");
            Prepare(save, userId, previewUrl);
            return save;
        }

        private static void Prepare<TPayload>(ISavedEntry<TPayload> save, Guid userId, string previewUrl) where TPayload : ISavedPayload
        {
            save.UserId = userId;
            var skill = save.Saved.Skill;
            foreach (var s in skill.OffenseSkills) s.Type = SkillType.OffenseSkill;
            foreach (var s in skill.DefenseSkills) s.Type = SkillType.DefenseSkill;
            foreach (var s in skill.PassiveSkills) s.Type = SkillType.PassiveSkill;
            foreach (var s in skill.CustomEffects) s.Type = SkillType.CustomEffect;
            foreach (var s in skill.MentalEffects) s.Type = SkillType.MentalEffect;
            IEnumerable<ImageObj> images =
            [
                save.ImageAttach, save.Saved.SplashArt, save.Saved.SinnerIcon,
                .. skill.OffenseSkills.Select(s => s.ImageAttach),
                .. skill.DefenseSkills.Select(s => s.ImageAttach),
                .. skill.CustomEffects.Select(s => s.ImageAttach),
            ];
            foreach (var image in images)
            {
                image.Status = AssetStatus.Uploaded;
                image.Url = $"https://cdn.test/{image.Id}.png";
            }
            save.ImageAttach.Url = previewUrl;
        }
    }
}
