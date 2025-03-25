using Microsoft.EntityFrameworkCore;
using RepositoryLayer.Models;
using RepositoryLayer.Repositories.Interface;
using RepositoryLayer.Utils.Obj;

namespace RepositoryLayer.Repositories
{
    public class SavedIDInfoRepository(ServerDbContext _ctx) : ISavedInfoRepository<SavedIDInfo,SavedId>
    {

        public async Task<SavedIDInfo> CreateNewSave(SavedIDInfo newSave)
        {
            await _ctx.AddAsync( newSave );
            await _ctx.SaveChangesAsync();
            return newSave;
        }


        public async Task<List<SavedIDInfo>> GetMultiSaved(SearchSaveParams option)
        {
            var name = option.searchName;
            var userId = option.userId;
            IQueryable<SavedIDInfo> query;

            
            query = _ctx.SavedIDInfos.Where(e=>e.Name.ToLower().Contains(option.searchName.ToLower())
            && e.UserId.ToString().Equals(option.userId))
            .OrderByDescending(s=>s.SaveTime)
            .Skip(option.page*option.limit)
            .Take(option.limit);

            return await query.ToListAsync();
        }

        public async Task<SavedIDInfo?> GetSaved(Guid id,bool includeSkill=false)
        {
            IQueryable<SavedIDInfo> query =_ctx.SavedIDInfos.Where(e=>e.Id==id);
            if(includeSkill) query = query.Include(s=>s.SavedId);
            return await query.FirstOrDefaultAsync();
        }

        public async Task<SavedIDInfo?> UpdateSaved( UpdateSaveParams<SavedId> newSave)
        {
            var foundSave = await _ctx.SavedIDInfos.Where(e => e.Id == newSave.UpdateId).Include(s => s.SavedId)
                .ThenInclude(savedId => savedId.Skill).ThenInclude(savedSkill => savedSkill.OffenseSkills)
                .Include(savedIdInfo => savedIdInfo.SavedId).ThenInclude(savedId => savedId.Skill)
                .ThenInclude(savedSkill => savedSkill.MentalEffects).Include(savedIdInfo => savedIdInfo.SavedId)
                .ThenInclude(savedId => savedId.Skill).ThenInclude(savedSkill => savedSkill.CustomEffects)
                .Include(savedIdInfo => savedIdInfo.SavedId).ThenInclude(savedId => savedId.Skill)
                .ThenInclude(savedSkill => savedSkill.PassiveSkills).Include(savedIdInfo => savedIdInfo.SavedId)
                .ThenInclude(savedId => savedId.Skill).ThenInclude(savedSkill => savedSkill.DefenseSkills).FirstOrDefaultAsync();
            if (foundSave == null) return foundSave;
            List<ImageObj> deletedImages = [];
            List<OffenseSkill> deletedOffenseSkill = [];
            List<DefenseSkill> deletedDefenseSkill = [];
            List<PassiveSkill> deletedPassiveSkill = [];
            List<CustomEffect> deletedCustomEffect = [];
            List<MentalEffect> deletedMentalEffect = [];
            var oldSkills =foundSave.SavedId.Skill;
            var skills =newSave.Saved.Skill;

            //Delete all the images and skills that does not have the same skillId as the new one
            //update the skill that been found
            //and remove the old skill to add the new skill
            foreach(var oldOffenseSkill in oldSkills.OffenseSkills)
            {
                var skill = skills.OffenseSkills.FirstOrDefault(offenseSkill => offenseSkill.Id==oldOffenseSkill.Id);
                if(skill==null)
                {
                    deletedOffenseSkill.Add(oldOffenseSkill);
                    deletedImages.Add(oldOffenseSkill.ImageAttach);
                }
                else
                {
                    _ctx.Entry(oldOffenseSkill).CurrentValues.SetValues(skill);
                    _ctx.Entry(oldOffenseSkill.ImageAttach).CurrentValues.SetValues(skill.ImageAttach);
                    newSave.Saved.Skill.OffenseSkills.Remove(skill);
                }
            }
            foreach(var oldDefenseSkill in oldSkills.DefenseSkills)
            {
                var skill =skills.DefenseSkills.FirstOrDefault(defenseSkill => defenseSkill.Id==oldDefenseSkill.Id); 
                if(skill==null)
                {
                    deletedDefenseSkill.Add(oldDefenseSkill);
                    deletedImages.Add(oldDefenseSkill.ImageAttach);
                }
                else
                {
                    _ctx.Entry(oldDefenseSkill).CurrentValues.SetValues(skill);
                    _ctx.Entry(oldDefenseSkill.ImageAttach).CurrentValues.SetValues(skill.ImageAttach);
                    newSave.Saved.Skill.DefenseSkills.Remove(skill);
                }
            }
            foreach(var oldPassiveSkill in oldSkills.PassiveSkills)
            {
                var skill =skills.PassiveSkills.Where(passiveSkill=>passiveSkill.Id==oldPassiveSkill.Id).FirstOrDefault();
                if(skill==null)
                {
                    deletedPassiveSkill.Add(oldPassiveSkill);
                }
                else
                {
                    _ctx.Entry(oldPassiveSkill).CurrentValues.SetValues(skill);
                    newSave.Saved.Skill.PassiveSkills.Remove(skill);
                }
            }
            foreach(var oldCustomEffect in oldSkills.CustomEffects)
            {
                var skill = skills.CustomEffects.FirstOrDefault(offenseSkill => offenseSkill.Id==oldCustomEffect.Id);
                if(skill==null)
                {
                    deletedCustomEffect.Add(oldCustomEffect);
                    deletedImages.Add(oldCustomEffect.ImageAttach);
                }
                else
                {
                    _ctx.Entry(oldCustomEffect).CurrentValues.SetValues(skill);
                    _ctx.Entry(oldCustomEffect.ImageAttach).CurrentValues.SetValues(skill.ImageAttach);
                    newSave.Saved.Skill.CustomEffects.Remove(skill);
                }
            }
            foreach(var oldMentalEffect in oldSkills.MentalEffects)
            {
                var skill = skills.MentalEffects.FirstOrDefault(offenseSkill => offenseSkill.Id==oldMentalEffect.Id);
                if(skill==null)
                {
                    deletedMentalEffect.Add(oldMentalEffect);
                }
                else
                {
                    _ctx.Entry(oldMentalEffect).CurrentValues.SetValues(skill);
                    newSave.Saved.Skill.MentalEffects.Remove(skill);
                }
            }

            foundSave.SaveTime = newSave.SaveTime;
            foundSave.ImageAttach.Url = newSave.ImageAttach;
            foundSave.ImageAttach.LastUpdated = DateTime.Now;
            _ctx.Entry(foundSave.SavedId.SplashArt).CurrentValues.SetValues(newSave.Saved.SplashArt);
            _ctx.Entry(foundSave.SavedId.SinnerIcon).CurrentValues.SetValues(newSave.Saved.SinnerIcon);
            _ctx.Entry(foundSave.SavedId).CurrentValues.SetValues(newSave.Saved);

            _ctx.OffenseSkill.RemoveRange(deletedOffenseSkill);
            _ctx.DefenseSkill.RemoveRange(deletedDefenseSkill);
            _ctx.PassiveSkill.RemoveRange(deletedPassiveSkill);
            _ctx.CustomEffect.RemoveRange(deletedCustomEffect);
            _ctx.MentalEffect.RemoveRange(deletedMentalEffect);
            _ctx.ImageObjs.RemoveRange(deletedImages);

            await _ctx.OffenseSkill.AddRangeAsync(newSave.Saved.Skill.OffenseSkills);
            await _ctx.DefenseSkill.AddRangeAsync(newSave.Saved.Skill.DefenseSkills);
            await _ctx.PassiveSkill.AddRangeAsync(newSave.Saved.Skill.PassiveSkills);
            await _ctx.CustomEffect.AddRangeAsync(newSave.Saved.Skill.CustomEffects);
            await _ctx.MentalEffect.AddRangeAsync(newSave.Saved.Skill.MentalEffects);

            await _ctx.SaveChangesAsync();
            return foundSave;
        }

        
        public async Task<SavedIDInfo?> DeleteSaved(Guid id)
        {
            var foundSave = await _ctx.SavedIDInfos.Where(e => e.Id == id).Include(s => s.SavedId)
                .ThenInclude(savedId => savedId.Skill).ThenInclude(savedSkill => savedSkill.OffenseSkills)
                .Include(savedIdInfo => savedIdInfo.SavedId).ThenInclude(savedId => savedId.Skill)
                .ThenInclude(savedSkill => savedSkill.DefenseSkills).Include(savedIdInfo => savedIdInfo.SavedId)
                .ThenInclude(savedId => savedId.Skill).ThenInclude(savedSkill => savedSkill.CustomEffects).FirstOrDefaultAsync();
            if (foundSave == null) return foundSave;
            //Add images for deletion
            List<ImageObj> deletedImages = [];
            deletedImages.Add(foundSave.ImageAttach);
            deletedImages.Add(foundSave.SavedId.SinnerIcon);
            deletedImages.Add(foundSave.SavedId.SplashArt);
            var skill = foundSave.SavedId.Skill;

            deletedImages.AddRange(skill.OffenseSkills.Select((t, j) => skill.OffenseSkills.ElementAt(j).ImageAttach));
            deletedImages.AddRange(skill.DefenseSkills.Select((t, j) => skill.DefenseSkills.ElementAt(j).ImageAttach));
            deletedImages.AddRange(skill.CustomEffects.Select((t, j) => skill.CustomEffects.ElementAt(j).ImageAttach));
                
            _ctx.SavedIDInfos.Remove(foundSave);
            _ctx.ImageObjs.RemoveRange(deletedImages);
            await _ctx.SaveChangesAsync();

            return foundSave;
        }

    }
}