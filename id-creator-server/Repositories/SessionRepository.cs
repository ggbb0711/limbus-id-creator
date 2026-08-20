


using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Interface.Repositories;
using Server.Models;

namespace Server.Repositories
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