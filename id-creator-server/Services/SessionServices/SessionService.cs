

using Server.Interface.Repositories;
using Server.Interface.ServiceInterface.SessionInterface;
using Server.Models;
using Server.Util.Config;
using Server.Util.Obj;

namespace Server.Services
{
    public class SessionService(ISessionRepository sessionRepository, EnvironmentVariables env) : ISessionService
    {
        public async Task<Session?> GetSessionById(Guid sessionId)
        {
            return await sessionRepository.GetByIdAsync(sessionId);
        }

        public async Task<Session> AddSession(Guid userId)
        {

            var newSession = new Session()
            {
                Id = Guid.NewGuid(),
                Created = DateTime.Now,
                Expired = DateTime.Now.AddDays(env.SessionExpiredDay),
                UserId = userId,
            };

            newSession = await sessionRepository.AddAsync(newSession);
            await sessionRepository.SaveChangeAsync();
            return newSession;
        }

        public async Task<Session?> DeleteSessionById(Guid sessionId)
        {
            var deleteSession = await sessionRepository.GetByIdAsync(sessionId);
            if (deleteSession == null) return null;
            await sessionRepository.RemoveAsync(deleteSession);
            return deleteSession;
        }

        public async Task<Session?> DeleteSessionByUserId(Guid userId)
        {
            var deleteSession = await sessionRepository.FindAsync(new RepositoryGetParams<Session>()
            {
                Filter = s=>s.UserId == userId,
            }).First();
            if(deleteSession == null) return null;
            return await sessionRepository.RemoveAsync(deleteSession);
        }
        

        public async Task<List<Session>> DeleteExpiredSessions()
        {
            return await sessionRepository.DeleteExpiredSessions();
        }

    }
}