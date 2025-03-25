using RepositoryLayer.Models;
using RepositoryLayer.Repositories.Interface;
using ServiceLayer.Interfaces.SessionService;

namespace ServiceLayer.Services.SessionServices
{
    public class SessionService: ISessionService
    {
        private readonly ISessionRepository _sessionRepository;
        public SessionService(ISessionRepository sessionRepository)
        {
            _sessionRepository = sessionRepository;
        }

        public async Task<Session?> GetSession(Guid sessionId)
        {
            return await _sessionRepository.FindSession(sessionId);
        }

        public async Task<Session?> AddSession(Guid userId)
        {

            var newSession = new Session()
            {
                Id = Guid.NewGuid(),
                Created = DateTime.Now,
                Expired = DateTime.Now.AddDays(int.Parse(Environment.GetEnvironmentVariable("SessionExpiredDay"))),
                UserId = userId,
            };

            newSession = await _sessionRepository.CreateSession(newSession);

            return newSession;
        }

        public async Task<Session?> DeleteSessionById(Guid sessionId)
        {
            return await _sessionRepository.DeleteSessionBySessionId(sessionId);
        }

        public async Task<Session?> DeleteSessionByUserId(Guid userId)
        {
            return await _sessionRepository.DeleteSessionByUserId(userId);
        }
        

        public async Task<List<Session>> DeleteExpiredSessions()
        {
            return await _sessionRepository.DeleteExpiredSessions();
        }

    }
}