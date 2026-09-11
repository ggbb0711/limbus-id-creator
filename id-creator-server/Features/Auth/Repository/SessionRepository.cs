


using Microsoft.EntityFrameworkCore;
using Server.Shared.Database;
using Server.Shared.Model;
using Server.Shared.Repository;

namespace Server.Features.Auth.Repository
{
    public class SessionRepository(ServerDbContext ctx) :Repository<Session>(ctx), ISessionRepository
    {
        public async Task<List<Session>> DeleteExpiredSessions()
        {
            var expiredSessions = await _ctx.Session
                .Where(session=>session.Expired<=DateTime.Now)
                .ToListAsync();

            if(expiredSessions.Count>0)
            {
                _ctx.Session.RemoveRange(expiredSessions);
                await _ctx.SaveChangesAsync();
            }

            return expiredSessions;
        }
    }
}
