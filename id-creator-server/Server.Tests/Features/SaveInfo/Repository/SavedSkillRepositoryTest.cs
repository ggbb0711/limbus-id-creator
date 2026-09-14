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
    }
}
