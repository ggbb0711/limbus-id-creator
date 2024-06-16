

using Server.Models;

namespace Server.Interface.Repositories
{
    public interface ISessionRepository
    {
        Task<Session?> DeleteSessionByUserId(Guid userId);
        Task<Session?> DeleteSessionBySessionId(Guid sessionId);
        Task<Session?> CreateSession(Session newSession);
        Task<Session?> FindSession(Guid sessionId);
        Task<List<Session>> DeleteExpiredSessions();
    }
}