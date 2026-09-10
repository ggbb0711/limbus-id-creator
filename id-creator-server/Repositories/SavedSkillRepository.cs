using Server.Data;
using Server.Interface.Repositories;
using Server.Interface.UtilInterfaces;
using Server.Models;

namespace Server.Repositories
{
    public class SavedSkillRepository(ServerDbContext ctx) : Repository<SavedSkill>(ctx), ISavedSkillRepository
    {
        public async Task<SavedSkill?> UpdateSavedSkill(SavedSkill incomingSkills)
        {
            var oldSavedSkill = await GetByIdAsync(incomingSkills.Id);
            if(oldSavedSkill != null)
            {
                await Task.WhenAll([
                    SyncSkillList((ICollection<ISkill>)oldSavedSkill.OffenseSkills,(ICollection<ISkill>) incomingSkills.OffenseSkills),
                    SyncSkillList((ICollection<ISkill>)oldSavedSkill.DefenseSkills,(ICollection<ISkill>) incomingSkills.DefenseSkills),
                    SyncSkillList((ICollection<ISkill>)oldSavedSkill.CustomEffects,(ICollection<ISkill>) incomingSkills.CustomEffects),
                    SyncSkillList((ICollection<ISkill>)oldSavedSkill.MentalEffects,(ICollection<ISkill>) incomingSkills.MentalEffects),
                    SyncSkillList((ICollection<ISkill>)oldSavedSkill.PassiveSkills,(ICollection<ISkill>) incomingSkills.PassiveSkills),
                ]);
                return incomingSkills;
            }
            return oldSavedSkill;
        }

        private async Task SyncSkillList(ICollection<ISkill> oldSkills, ICollection<ISkill> newSkills)
        {
            foreach(var newSkill in newSkills)
            {
                var skill = oldSkills.FirstOrDefault(x => x.Id == newSkill.Id);
                if(skill != null)
                {
                    _ctx.Entry(skill).CurrentValues.SetValues(newSkill);
                }
                else
                {
                    await _ctx.AddAsync(newSkill);
                }
            }
            var toDeleteSkills = new List<ISkill>();
            foreach(var oldSkill in oldSkills)
            {
                if(newSkills.Any(newSkill => newSkill.Id == oldSkill.Id))
                {
                    toDeleteSkills.Add(oldSkill);
                }
            }
            _ctx.RemoveRange(toDeleteSkills);
        }
    }
}