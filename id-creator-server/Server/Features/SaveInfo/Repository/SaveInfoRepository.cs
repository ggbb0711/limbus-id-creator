using Microsoft.EntityFrameworkCore;
using Server.Shared.Database;
using Server.Shared.Model.Interface;
using Server.Shared.Repository;

namespace Server.Features.SaveInfo.Repository
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
        public Task MergeSavedInfo(TEntry tracked, TEntry incoming)
        {
            tracked.Name = incoming.Name;
            tracked.SaveTime = incoming.SaveTime;
            tracked.ImageAttach.Url = incoming.ImageAttach.Url;
            tracked.ImageAttach.LastUpdated = DateTime.Now;
            _ctx.Entry(tracked.Saved.SplashArt).CurrentValues.SetValues(incoming.Saved.SplashArt);
            _ctx.Entry(tracked.Saved.SinnerIcon).CurrentValues.SetValues(incoming.Saved.SinnerIcon);
            _ctx.Entry(tracked.Saved).CurrentValues.SetValues(incoming.Saved);
            return Task.CompletedTask;
        }
    }
}
