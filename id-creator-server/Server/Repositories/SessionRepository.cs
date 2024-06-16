


using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Interface.Repositories;
using Server.Models;

namespace Server.Repositories
{
    public class SessionRepository:ISessionRepository
    {
        private readonly ServerDbContext _ctx;
        public SessionRepository(ServerDbContext ctx)
        {
            this._ctx = ctx;
        }

         public async Task<Session?> DeleteSessionByUserId(Guid UserId)
        {
            
            var deleteSession = await _ctx.Session.Where(Session=>Session.UserId == UserId).FirstOrDefaultAsync();
            if(deleteSession != null)
            {
                _ctx.Session.Remove(deleteSession);
                await _ctx.SaveChangesAsync();
            }
            

            return deleteSession;    

        }

        public async Task<Session?> DeleteSessionBySessionId(Guid SessionId)
        {
            
            var deleteSession = await _ctx.Session.Where(Session=>Session.Id == SessionId).FirstOrDefaultAsync();
            if(deleteSession != null)
            {
                _ctx.Session.Remove(deleteSession);
                await _ctx.SaveChangesAsync();
            }
            

            return deleteSession;    

        }

        public async Task<Session?> CreateSession(Session newSession)
        {
            await _ctx.Session.AddAsync(newSession);

            await _ctx.SaveChangesAsync();
            return newSession;
            
        }

        public async Task<Session?> FindSession(Guid SessionId)
        {
            return await _ctx.Session.Where(Session => Session.Id == SessionId).FirstOrDefaultAsync();
        }

        public async Task<List<Session>> DeleteExpiredSessions()
        {
            var expiredSession = _ctx.Session.Where(session=>session.Expired<=DateTime.Now);

            if(expiredSession != null)
            {
                _ctx.Session.RemoveRange(expiredSession);
                await _ctx.SaveChangesAsync();
            }

            return await expiredSession.ToListAsync();
        }
    }
}