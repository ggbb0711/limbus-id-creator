using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Interface.Repositories;
using Server.Interface.UtilInterfaces;

namespace Server.Repositories
{
    public class SaveInfoRepository<TEntry, TPayload>(ServerDbContext ctx) : Repository<TEntry>(ctx),ISaveInfoRepository<TEntry,TPayload>
        where TEntry : class, ISavedEntry<TPayload>
        where TPayload : class, ISavedPayload
    {
        public async Task<TEntry?> GetByIdAsyncIncludingSaved(Guid id) =>
        await Set
          .Include(e => e.Saved).ThenInclude(s => s.SplashArt)
          .Include(e => e.Saved).ThenInclude(s => s.SinnerIcon)
          .Include(e => e.Saved).ThenInclude(s => s.Skill).ThenInclude(sk => sk.OffenseSkills)
          .Include(e => e.Saved).ThenInclude(s => s.Skill).ThenInclude(sk => sk.DefenseSkills)
          .Include(e => e.Saved).ThenInclude(s => s.Skill).ThenInclude(sk => sk.PassiveSkills)
          .Include(e => e.Saved).ThenInclude(s => s.Skill).ThenInclude(sk => sk.CustomEffects)
          .Include(e => e.Saved).ThenInclude(s => s.Skill).ThenInclude(sk => sk.MentalEffects)
          .FirstOrDefaultAsync(e => e.Id == id);
        public new async Task UpdateAsync(TEntry newSave)
        {
            var foundSave = await GetByIdAsyncIncludingSaved(newSave.Id);
            if (foundSave != null)
            {
                foundSave.Name = newSave.Name;
                foundSave.SaveTime = newSave.SaveTime;
                foundSave.ImageAttach.Url = newSave.ImageAttach.Url;
                foundSave.ImageAttach.LastUpdated = DateTime.Now;
                _ctx.Entry(foundSave.Saved.SplashArt).CurrentValues.SetValues(newSave.Saved.SplashArt);
                _ctx.Entry(foundSave.Saved.SinnerIcon).CurrentValues.SetValues(newSave.Saved.SinnerIcon);
                _ctx.Entry(foundSave.Saved).CurrentValues.SetValues(newSave.Saved);
            }
        }
    }
}