

using Server.Interface.Repositories;
using Server.Interface.ServiceInterface.SessionInterface;
using Server.Models;
using Server.Util.Config;

namespace Server.Services
{
    public class SessionService(ISessionRepository sessionRepository, EnvironmentVariables env) : ISessionService
    {
        public async Task<Session?> GetSession(Guid sessionId)
        {
            return await sessionRepository.FindSession(sessionId);
        }

        public async Task<Session?> AddSession(Guid userId)
        {

            var newSession = new Session()
            {
                Id = Guid.NewGuid(),
                Created = DateTime.Now,
                Expired = DateTime.Now.AddDays(env.SessionExpiredDay),
                UserId = userId,
            };

            newSession = await sessionRepository.CreateSession(newSession);

            return newSession;
        }

        public async Task<Session?> DeleteSessionById(Guid sessionId)
        {
            return await sessionRepository.DeleteSessionBySessionId(sessionId);
        }

        public async Task<Session?> DeleteSessionByUserId(Guid userId)
        {
            return await sessionRepository.DeleteSessionByUserId(userId);
        }
        

        public async Task<List<Session>> DeleteExpiredSessions()
        {
            return await sessionRepository.DeleteExpiredSessions();
        }

    }
}