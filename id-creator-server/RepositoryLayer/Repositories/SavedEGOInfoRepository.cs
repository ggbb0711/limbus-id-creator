using Microsoft.EntityFrameworkCore;
using RepositoryLayer.Models;
using RepositoryLayer.Repositories.Interface;
using RepositoryLayer.Utils.Obj;

namespace RepositoryLayer.Repositories
{
    public class SavedEGOInfoRepository(ServerDbContext ctx) : ISavedInfoRepository<SavedEGOInfo,SavedEgo>
    {
        private readonly ServerDbContext _ctx = ctx;

        public async Task<SavedEGOInfo> CreateNewSave(SavedEGOInfo newSave)
        {
            await _ctx.AddAsync( newSave );
            await _ctx.SaveChangesAsync();
            return newSave;
        }


        public async Task<List<SavedEGOInfo>> GetMultiSaved(SearchSaveParams option)
        {
            var name = option.searchName;
            var userId = option.userId;
            IQueryable<SavedEGOInfo> query;

            
            query = _ctx.SavedEGOInfos.Where(e=>e.Name.ToLower().Contains(option.searchName.ToLower())
            &&e.UserId.ToString().Equals(option.userId))
            .OrderByDescending(s=>s.SaveTime)
            .Skip(option.page*option.limit)
            .Take(option.limit);

            return await query.ToListAsync();
        }

        Task<SavedEGOInfo?> ISavedInfoRepository<SavedEGOInfo, SavedEgo>.UpdateSaved(UpdateSaveParams<SavedEgo> newID)
        {
            return UpdateSaved(newID);
        }

        public async Task<SavedEGOInfo?> GetSaved(Guid id,bool includeSkill=false)
        {
            IQueryable<SavedEGOInfo> query = _ctx.SavedEGOInfos.Where(e=>e.Id==id);
            if(includeSkill) query = query.Include(s=>s.SavedEgo);
            return await query.FirstOrDefaultAsync();
        }

        public async Task<SavedEGOInfo?> UpdateSaved( UpdateSaveParams<SavedEgo> newSave)
        {
            var foundSave = await _ctx.SavedEGOInfos.Where(e => e.Id == newSave.UpdateId).Include(s => s.SavedEgo)
                .ThenInclude(savedEgo => savedEgo.Skill).ThenInclude(savedSkill => savedSkill.OffenseSkills)
                .Include(savedEgoInfo => savedEgoInfo.SavedEgo).ThenInclude(savedEgo => savedEgo.Skill)
                .ThenInclude(savedSkill => savedSkill.DefenseSkills).Include(savedEgoInfo => savedEgoInfo.SavedEgo)
                .ThenInclude(savedEgo => savedEgo.Skill).ThenInclude(savedSkill => savedSkill.CustomEffects)
                .Include(savedEgoInfo => savedEgoInfo.SavedEgo).ThenInclude(savedEgo => savedEgo.Skill)
                .ThenInclude(savedSkill => savedSkill.MentalEffects).FirstOrDefaultAsync();
            if (foundSave == null) return foundSave;
            List<ImageObj> deletedImages = [];
            List<OffenseSkill> deletedOffenseSkill = [];
            List<DefenseSkill> deletedDefenseSkill = [];
            List<PassiveSkill> deletedPassiveSkill = [];
            List<CustomEffect> deletedCustomEffect = [];
            List<MentalEffect> deletedMentalEffect = [];
            var oldSkills =foundSave.SavedEgo.Skill;
            var skills =newSave.Saved.Skill;

            //Delete all the images and skills that does not have the same skillId as the new one
            //update the skill that been found
            //and remove the old skill to add the new skill
            foreach(var oldOffenseSkill in oldSkills.OffenseSkills)
            {
                var skill = skills.OffenseSkills.Where(offenseSkill=>offenseSkill.Id==oldOffenseSkill.Id).FirstOrDefault();
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
            _ctx.Entry(foundSave.SavedEgo.SplashArt).CurrentValues.SetValues(newSave.Saved.SplashArt);
            _ctx.Entry(foundSave.SavedEgo.SinnerIcon).CurrentValues.SetValues(newSave.Saved.SinnerIcon);
            _ctx.Entry(foundSave.SavedEgo).CurrentValues.SetValues(newSave.Saved);

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

        
        public async Task<SavedEGOInfo?> DeleteSaved(Guid id)
        {
            var foundSave = await _ctx.SavedEGOInfos.Where(e => e.Id == id).Include(s => s.SavedEgo)
                .ThenInclude(savedEgo => savedEgo.Skill).ThenInclude(savedSkill => savedSkill.OffenseSkills)
                .Include(savedEgoInfo => savedEgoInfo.SavedEgo).ThenInclude(savedEgo => savedEgo.Skill)
                .ThenInclude(savedSkill => savedSkill.DefenseSkills).Include(savedEgoInfo => savedEgoInfo.SavedEgo)
                .ThenInclude(savedEgo => savedEgo.Skill).ThenInclude(savedSkill => savedSkill.CustomEffects).FirstOrDefaultAsync();
            if (foundSave == null) return foundSave;
            //Add images for deletion
            List<ImageObj> deletedImages = [];
            deletedImages.Add(foundSave.ImageAttach);
            deletedImages.Add(foundSave.SavedEgo.SinnerIcon);
            deletedImages.Add(foundSave.SavedEgo.SplashArt);
            var skill = foundSave.SavedEgo.Skill;

            deletedImages.AddRange(skill.OffenseSkills.Select((t, j) => skill.OffenseSkills.ElementAt(j).ImageAttach));
            deletedImages.AddRange(skill.DefenseSkills.Select((t, j) => skill.DefenseSkills.ElementAt(j).ImageAttach));
            deletedImages.AddRange(skill.CustomEffects.Select((t, j) => skill.CustomEffects.ElementAt(j).ImageAttach));


            _ctx.SavedEGOInfos.Remove(foundSave);
            _ctx.ImageObjs.RemoveRange(deletedImages);
            await _ctx.SaveChangesAsync();

            return foundSave;
        }

    }
}