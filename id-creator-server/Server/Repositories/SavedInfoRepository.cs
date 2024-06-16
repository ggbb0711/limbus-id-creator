



using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Server.Data;
using Server.Interface.Repositories;
using Server.Models;
using Server.Util.Obj;

namespace Server.Repositories
{
    public class SavedInfoRepository(ServerDbContext ctx) : ISavedInfoRepository
    {
        private readonly ServerDbContext _ctx = ctx;

        public async Task<SavedInfo> CreateNewSave(SavedInfo newSave)
        {
            await _ctx.AddAsync( newSave );
            await _ctx.SaveChangesAsync();
            return newSave;
        }


        public async Task<List<SavedInfo>> GetMultiSaved(SearchSaveParams option)
        {
            var name = option.searchName;
            var tags = option.searchTags;
            var userId = option.userId;

            if(option.searchType.Equals("ID"))
            {
                return await _ctx.SavedInfos.Where(e=>e.SaveIdKey!=null
                &&e.Name.Contains(name)
                &&e.Tags.Count(tag=>tags.Contains(tag.TagName))==tags.Length
                &&e.UserId.ToString().Equals(userId)
                &&e.IsPublic==option.IsPublic).ToListAsync();
            }
            if(option.searchType.Equals("EGO"))
            {
                return await _ctx.SavedInfos.Where(e=>e.SaveEgoKey!=null
                &&e.Name.Contains(name)
                &&e.Tags.Count(tag=>tags.Contains(tag.TagName))==tags.Length
                &&e.UserId.ToString().Equals(userId)
                &&e.IsPublic==option.IsPublic).ToListAsync();
            }
            

            return await _ctx.SavedInfos.Where(e=>e.Name.Contains(name)
                &&e.Tags.Count(tag=>tags.Contains(tag.TagName))==tags.Length
                &&e.UserId.ToString().Equals(userId)
                &&e.IsPublic==option.IsPublic).ToListAsync();
        }

        public Task<SavedInfo?> GetSaved(Guid id,bool isPublic)
        {
            return _ctx.SavedInfos.Where(e=>e.Id==id&&e.IsPublic==isPublic).FirstOrDefaultAsync();
        }

        public async Task<SavedInfo?> UpdateSaved(Guid id, UpdateSaveParams newSave)
        {
            var foundSave = await _ctx.SavedInfos.Where(e=>e.Id == id).FirstOrDefaultAsync();
            if(foundSave!=null)
            {
                if(!newSave.Name.IsNullOrEmpty())foundSave.Name = newSave.Name;
                if(newSave.SaveTime!=null)foundSave.SaveTime = newSave.SaveTime;
                if(newSave.Tags!=null)foundSave.Tags = newSave.Tags;
                if(!newSave.ImageAttach.IsNullOrEmpty())foundSave.ImageAttach = newSave.ImageAttach;
                if(newSave.SavedId!=null)foundSave.SavedId = newSave.SavedId;
                if(newSave.SavedEgo!=null)foundSave.SavedEgo = newSave.SavedEgo;
            }
            
            return foundSave;
        }

        
        public async Task<SavedInfo?> DeleteSaved(Guid id)
        {
            var foundSave = await _ctx.SavedInfos.Where(e=>e.Id == id).FirstOrDefaultAsync();
            if(foundSave!=null)
            {
                _ctx.SavedInfos.Remove(foundSave);
                await _ctx.SaveChangesAsync();
            }

            return foundSave;
        }
    }
}