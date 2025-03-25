using Microsoft.EntityFrameworkCore;
using RepositoryLayer.Models;
using RepositoryLayer.Repositories.Interface;

namespace RepositoryLayer.Repositories
{
    public class SessionRepository(ServerDbContext ctx) : ISessionRepository
    {
        public async Task<Session?> DeleteSessionByUserId(Guid UserId)
        {
            
            var deleteSession = await ctx.Session.Where(session =>session.UserId == UserId).FirstOrDefaultAsync();
            if (deleteSession == null) return deleteSession;
            ctx.Session.Remove(deleteSession);
            await ctx.SaveChangesAsync();
            return deleteSession;    
        }

        public async Task<Session?> DeleteSessionBySessionId(Guid SessionId)
        {
            
            var deleteSession = await ctx.Session.Where(Session=>Session.Id == SessionId).FirstOrDefaultAsync();
            if (deleteSession == null) return deleteSession;
            ctx.Session.Remove(deleteSession);
            await ctx.SaveChangesAsync();
            return deleteSession;
        }

        public async Task<Session?> CreateSession(Session newSession)
        {
            await ctx.Session.AddAsync(newSession);

            await ctx.SaveChangesAsync();
            return newSession;
            
        }

        public async Task<Session?> FindSession(Guid SessionId)
        {
            return await ctx.Session.Where(Session => Session.Id == SessionId).FirstOrDefaultAsync();
        }

        public async Task<List<Session>> DeleteExpiredSessions()
        {
            var expiredSession = ctx.Session.Where(session=>session.Expired<=DateTime.Now);

            ctx.Session.RemoveRange(expiredSession);
            await ctx.SaveChangesAsync();

            return await expiredSession.ToListAsync();
        }
    }
}