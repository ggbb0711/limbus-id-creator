using AutoFixture;
using Microsoft.EntityFrameworkCore;
using Server.Features.SaveInfo.Repository;
using Server.Shared.Model;

namespace Server.Tests.Features.SaveInfo.Repository
{
    public class SavedSkillRepositoryTest
    {
        [Fact]
        public async Task ShouldUpdateSkillWithReconcilliation()
        {
            var db = MockDatabase.CreateDbConnection();
            var fixture = new Fixture();

            var savedSkillId = Guid.NewGuid();

            var meToUpdateId = Guid.NewGuid();
            var meToDeleteId = Guid.NewGuid();
            var psToUpdateId = Guid.NewGuid();

            var meToUpdate = fixture.Build<MentalEffect>()
                .With(x => x.Id, meToUpdateId)
                .With(x => x.SavedSkillId, savedSkillId)
                .With(x => x.Effect, "Old Effect")
                .Create();

            var meToDelete = fixture.Build<MentalEffect>()
                .With(x => x.Id, meToDeleteId)
                .With(x => x.SavedSkillId, savedSkillId)
                .Create();

            var psToUpdate = fixture.Build<PassiveSkill>()
                .With(x => x.Id, psToUpdateId)
                .With(x => x.SavedSkillId, savedSkillId)
                .With(x => x.Name, "Old Passive")
                .Create();

            var oldSavedSkill = new SavedSkill
            {
                Id = savedSkillId,
                MentalEffects = [meToUpdate, meToDelete],
                PassiveSkills = [psToUpdate],
                OffenseSkills = [],
                DefenseSkills = [],
                CustomEffects = [],
            };

            db.SavedSkill.Add(oldSavedSkill);
            await db.SaveChangesAsync();
            db.ChangeTracker.Clear();

            var trackedOldSkill = await db.SavedSkill
                .Include(s => s.MentalEffects)
                .Include(s => s.PassiveSkills)
                .Include(s => s.OffenseSkills)
                .Include(s => s.DefenseSkills)
                .Include(s => s.CustomEffects)
                .FirstAsync(s => s.Id == savedSkillId);

            var meUpdated = fixture.Build<MentalEffect>()
                .With(x => x.Id, meToUpdateId)
                .With(x => x.SavedSkillId, savedSkillId)
                .With(x => x.Effect, "New Effect")
                .Create();

            var meNew = fixture.Build<MentalEffect>()
                .With(x => x.Id, Guid.NewGuid())
                .With(x => x.SavedSkillId, savedSkillId)
                .Create();

            var psUpdated = fixture.Build<PassiveSkill>()
                .With(x => x.Id, psToUpdateId)
                .With(x => x.SavedSkillId, savedSkillId)
                .With(x => x.Name, "New Passive")
                .Create();

            var psNew = fixture.Build<PassiveSkill>()
                .With(x => x.Id, Guid.NewGuid())
                .With(x => x.SavedSkillId, savedSkillId)
                .Create();

            var incomingSkill = new SavedSkill
            {
                Id = savedSkillId,
                MentalEffects = [meUpdated, meNew],
                PassiveSkills = [psUpdated, psNew],
                OffenseSkills = [],
                DefenseSkills = [],
                CustomEffects = [],
            };

            var repo = new SavedSkillRepository(db);
            await repo.UpdateSavedSkill(trackedOldSkill, incomingSkill);
            await db.SaveChangesAsync();
            db.ChangeTracker.Clear();

            var result = await db.SavedSkill
                .Include(s => s.MentalEffects)
                .Include(s => s.PassiveSkills)
                .FirstAsync(s => s.Id == savedSkillId);

            Assert.Equal(2, result.MentalEffects.Count);
            var updatedMe = Assert.Single(result.MentalEffects, m => m.Id == meToUpdateId);
            Assert.Equal("New Effect", updatedMe.Effect);
            Assert.Contains(result.MentalEffects, m => m.Id == meNew.Id);
            Assert.DoesNotContain(result.MentalEffects, m => m.Id == meToDeleteId);

            Assert.Equal(2, result.PassiveSkills.Count);
            var updatedPs = Assert.Single(result.PassiveSkills, p => p.Id == psToUpdateId);
            Assert.Equal("New Passive", updatedPs.Name);
            Assert.Contains(result.PassiveSkills, p => p.Id == psNew.Id);
        }

        [Fact]
        public async Task ShouldReassignImageUrl_ForMatchedOffenseDefenseAndCustomEffectSkills_WhenUrlChanges()
        {
            var db = MockDatabase.CreateDbConnection();
            var fixture = new Fixture();

            var savedSkillId = Guid.NewGuid();

            var offense = MockSaveData.CreateOffenseSkills(fixture, 0)[0];
            offense.SavedSkillId = savedSkillId;
            var defense = MockSaveData.CreateDefenseSkills(fixture, 0)[0];
            defense.SavedSkillId = savedSkillId;
            var custom = MockSaveData.CreateCustomEffects(fixture, 0)[0];
            custom.SavedSkillId = savedSkillId;

            var oldSavedSkill = new SavedSkill
            {
                Id = savedSkillId,
                OffenseSkills = [offense],
                DefenseSkills = [defense],
                CustomEffects = [custom],
                PassiveSkills = [],
                MentalEffects = [],
            };

            db.SavedSkill.Add(oldSavedSkill);
            await db.SaveChangesAsync();
            db.ChangeTracker.Clear();

            var trackedOldSkill = await db.SavedSkill
                .Include(s => s.MentalEffects)
                .Include(s => s.PassiveSkills)
                .Include(s => s.OffenseSkills)
                .Include(s => s.DefenseSkills)
                .Include(s => s.CustomEffects)
                .FirstAsync(s => s.Id == savedSkillId);

            var originalOffenseImageId = offense.ImageAttach.Id;
            var originalDefenseImageId = defense.ImageAttach.Id;
            var originalCustomImageId = custom.ImageAttach.Id;

            var incomingOffense = MockSaveData.CreateOffenseSkills(fixture, 0)[0];
            incomingOffense.Id = offense.Id;
            incomingOffense.SavedSkillId = savedSkillId;
            incomingOffense.ImageAttach.Id = originalOffenseImageId;
            incomingOffense.ImageAttachId = originalOffenseImageId;
            incomingOffense.ImageAttach.Url = "https://example.com/new-offense.png";

            var incomingDefense = MockSaveData.CreateDefenseSkills(fixture, 0)[0];
            incomingDefense.Id = defense.Id;
            incomingDefense.SavedSkillId = savedSkillId;
            incomingDefense.ImageAttach.Id = originalDefenseImageId;
            incomingDefense.ImageAttachId = originalDefenseImageId;
            incomingDefense.ImageAttach.Url = "https://example.com/new-defense.png";

            var incomingCustom = MockSaveData.CreateCustomEffects(fixture, 0)[0];
            incomingCustom.Id = custom.Id;
            incomingCustom.SavedSkillId = savedSkillId;
            incomingCustom.ImageAttach.Id = originalCustomImageId;
            incomingCustom.ImageAttachId = originalCustomImageId;
            incomingCustom.ImageAttach.Url = "https://example.com/new-custom.png";

            var incomingSkill = new SavedSkill
            {
                Id = savedSkillId,
                OffenseSkills = [incomingOffense],
                DefenseSkills = [incomingDefense],
                CustomEffects = [incomingCustom],
                PassiveSkills = [],
                MentalEffects = [],
            };

            var repo = new SavedSkillRepository(db);
            await repo.UpdateSavedSkill(trackedOldSkill, incomingSkill);
            await db.SaveChangesAsync();
            db.ChangeTracker.Clear();

            var reloadedOffense = await db.OffenseSkill.Include(s => s.ImageAttach)
                .FirstAsync(s => s.Id == offense.Id && s.SavedSkillId == savedSkillId);
            Assert.Equal("https://example.com/new-offense.png", reloadedOffense.ImageAttach.Url);
            Assert.Equal(originalOffenseImageId, reloadedOffense.ImageAttach.Id);

            var reloadedDefense = await db.DefenseSkill.Include(s => s.ImageAttach)
                .FirstAsync(s => s.Id == defense.Id && s.SavedSkillId == savedSkillId);
            Assert.Equal("https://example.com/new-defense.png", reloadedDefense.ImageAttach.Url);
            Assert.Equal(originalDefenseImageId, reloadedDefense.ImageAttach.Id);

            var reloadedCustom = await db.CustomEffect.Include(s => s.ImageAttach)
                .FirstAsync(s => s.Id == custom.Id && s.SavedSkillId == savedSkillId);
            Assert.Equal("https://example.com/new-custom.png", reloadedCustom.ImageAttach.Url);
            Assert.Equal(originalCustomImageId, reloadedCustom.ImageAttach.Id);
        }
    }
}
