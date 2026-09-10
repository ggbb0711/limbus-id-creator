using Server.Data;
using Server.Interface.Repositories;
using Server.Interface.UtilInterfaces;
using Server.Models;

namespace Server.Repositories
{
    public class SavedSkillRepository(ServerDbContext ctx) : Repository<SavedSkill>(ctx), ISavedSkillRepository
    {
        public async Task<SavedSkill> UpdateSavedSkill(SavedSkill oldSavedSkill, SavedSkill incomingSkills)
        {
            await Task.WhenAll([
                SyncSkillList(oldSavedSkill.OffenseSkills, incomingSkills.OffenseSkills),
                SyncSkillList(oldSavedSkill.DefenseSkills, incomingSkills.DefenseSkills),
                SyncSkillList(oldSavedSkill.CustomEffects, incomingSkills.CustomEffects),
                SyncSkillList(oldSavedSkill.MentalEffects, incomingSkills.MentalEffects),
                SyncSkillList(oldSavedSkill.PassiveSkills, incomingSkills.PassiveSkills),
            ]);
            return incomingSkills;
        }

        private async Task SyncSkillList<T>(ICollection<T> oldSkills, ICollection<T> newSkills) where T: ISkill
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
                if(!newSkills.Any(newSkill => newSkill.Id == oldSkill.Id))
                {
                    toDeleteSkills.Add(oldSkill);
                }
            }
            _ctx.RemoveRange(toDeleteSkills);
        }
    }
}