using AutoFixture;
using Server.Features.SaveInfo.Repository;
using Server.Shared.Model;

namespace Server.Tests.Features.SaveInfo.Repository
{
    public class SaveInfoRepositoryTest
    {
        [Fact]
        public async Task ShouldGetIncludingSavedAndMergeCorrectly_ForSavedId()
        {
            var db = MockDatabase.CreateDbConnection();
            var fixture = new Fixture();

            var skillId = Guid.NewGuid();
            var entry = CreateSavedIdEntry(fixture, skillId, "Old Effect");

            db.SavedIDInfos.Add(entry);
            await db.SaveChangesAsync();
            db.ChangeTracker.Clear();

            var repo = new SaveInfoRepository<SavedIDInfo, SavedId>(db);

            var tracked = await repo.GetByIdAsyncIncludingSaved(entry.Id);

            Assert.NotNull(tracked);
            Assert.NotNull(tracked!.Saved);
            Assert.NotNull(tracked.Saved.SplashArt);
            Assert.Equal(entry.Saved.SplashArt.Url, tracked.Saved.SplashArt.Url);
            Assert.NotNull(tracked.Saved.SinnerIcon);
            Assert.Equal(entry.Saved.SinnerIcon.Url, tracked.Saved.SinnerIcon.Url);
            Assert.NotNull(tracked.Saved.Skill);
            Assert.Single(tracked.Saved.Skill.MentalEffects);
            Assert.Equal("Old Effect", tracked.Saved.Skill.MentalEffects.First().Effect);
            Assert.Empty(tracked.Saved.Skill.OffenseSkills);
            Assert.Empty(tracked.Saved.Skill.DefenseSkills);
            Assert.Empty(tracked.Saved.Skill.PassiveSkills);
            Assert.Empty(tracked.Saved.Skill.CustomEffects);

            var incoming = CreateSavedIdEntry(fixture, Guid.NewGuid(), "Should Not Appear");
            incoming.Id = entry.Id;
            incoming.Saved.Id = tracked.Saved.Id;
            incoming.Saved.SplashArt.Id = tracked.Saved.SplashArt.Id;
            incoming.Saved.SplashArtId = tracked.Saved.SplashArt.Id;
            incoming.Saved.SinnerIcon.Id = tracked.Saved.SinnerIcon.Id;
            incoming.Saved.SinnerIconId = tracked.Saved.SinnerIcon.Id;

            await repo.MergeSavedInfo(tracked, incoming);
            await db.SaveChangesAsync();
            db.ChangeTracker.Clear();

            var reloaded = await repo.GetByIdAsyncIncludingSaved(entry.Id);

            Assert.NotNull(reloaded);
            Assert.Equal(incoming.Name, reloaded!.Name);
            Assert.Equal(incoming.SaveTime, reloaded.SaveTime);
            Assert.Equal(incoming.ImageAttach.Url, reloaded.ImageAttach.Url);

            Assert.Equal(incoming.Saved.Title, reloaded.Saved.Title);
            Assert.Equal(incoming.Saved.HP, reloaded.Saved.HP);
            Assert.Equal(incoming.Saved.SplashArt.Url, reloaded.Saved.SplashArt.Url);
            Assert.Equal(incoming.Saved.SinnerIcon.Url, reloaded.Saved.SinnerIcon.Url);

            Assert.Equal(skillId, reloaded.Saved.Skill.Id);
            Assert.Single(reloaded.Saved.Skill.MentalEffects);
            Assert.Equal("Old Effect", reloaded.Saved.Skill.MentalEffects.First().Effect);
        }

        [Fact]
        public async Task ShouldGetIncludingSavedAndMergeCorrectly_ForSavedEgo()
        {
            var db = MockDatabase.CreateDbConnection();
            var fixture = new Fixture();

            var skillId = Guid.NewGuid();
            var entry = CreateSavedEgoEntry(fixture, skillId, "Old Effect");

            db.SavedEGOInfos.Add(entry);
            await db.SaveChangesAsync();
            db.ChangeTracker.Clear();

            var repo = new SaveInfoRepository<SavedEGOInfo, SavedEgo>(db);

            var tracked = await repo.GetByIdAsyncIncludingSaved(entry.Id);

            Assert.NotNull(tracked);
            Assert.NotNull(tracked!.Saved);
            Assert.NotNull(tracked.Saved.SplashArt);
            Assert.Equal(entry.Saved.SplashArt.Url, tracked.Saved.SplashArt.Url);
            Assert.NotNull(tracked.Saved.SinnerIcon);
            Assert.Equal(entry.Saved.SinnerIcon.Url, tracked.Saved.SinnerIcon.Url);
            Assert.NotNull(tracked.Saved.Skill);
            Assert.Single(tracked.Saved.Skill.MentalEffects);
            Assert.Equal("Old Effect", tracked.Saved.Skill.MentalEffects.First().Effect);
            Assert.Empty(tracked.Saved.Skill.OffenseSkills);
            Assert.Empty(tracked.Saved.Skill.DefenseSkills);
            Assert.Empty(tracked.Saved.Skill.PassiveSkills);
            Assert.Empty(tracked.Saved.Skill.CustomEffects);

            var incoming = CreateSavedEgoEntry(fixture, Guid.NewGuid(), "Should Not Appear");
            incoming.Id = entry.Id;
            incoming.Saved.Id = tracked.Saved.Id;
            incoming.Saved.SplashArt.Id = tracked.Saved.SplashArt.Id;
            incoming.Saved.SplashArtId = tracked.Saved.SplashArt.Id;
            incoming.Saved.SinnerIcon.Id = tracked.Saved.SinnerIcon.Id;
            incoming.Saved.SinnerIconId = tracked.Saved.SinnerIcon.Id;

            await repo.MergeSavedInfo(tracked, incoming);
            await db.SaveChangesAsync();
            db.ChangeTracker.Clear();

            var reloaded = await repo.GetByIdAsyncIncludingSaved(entry.Id);

            Assert.NotNull(reloaded);
            Assert.Equal(incoming.Name, reloaded!.Name);
            Assert.Equal(incoming.SaveTime, reloaded.SaveTime);
            Assert.Equal(incoming.ImageAttach.Url, reloaded.ImageAttach.Url);

            Assert.Equal(incoming.Saved.Title, reloaded.Saved.Title);
            Assert.Equal(incoming.Saved.SanityCost, reloaded.Saved.SanityCost);
            Assert.Equal(incoming.Saved.SplashArt.Url, reloaded.Saved.SplashArt.Url);
            Assert.Equal(incoming.Saved.SinnerIcon.Url, reloaded.Saved.SinnerIcon.Url);

            Assert.Equal(skillId, reloaded.Saved.Skill.Id);
            Assert.Single(reloaded.Saved.Skill.MentalEffects);
            Assert.Equal("Old Effect", reloaded.Saved.Skill.MentalEffects.First().Effect);
        }

        private static SavedIDInfo CreateSavedIdEntry(Fixture fixture, Guid skillId, string mentalEffectText)
        {
            var entryId = Guid.NewGuid();

            var skill = new SavedSkill
            {
                Id = skillId,
                OffenseSkills = [],
                DefenseSkills = [],
                PassiveSkills = [],
                CustomEffects = [],
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

        private static SavedEGOInfo CreateSavedEgoEntry(Fixture fixture, Guid skillId, string mentalEffectText)
        {
            var entryId = Guid.NewGuid();

            var skill = new SavedSkill
            {
                Id = skillId,
                OffenseSkills = [],
                DefenseSkills = [],
                PassiveSkills = [],
                CustomEffects = [],
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
    }
}
