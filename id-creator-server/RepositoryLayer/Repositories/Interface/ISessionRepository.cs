

using RepositoryLayer.Models;

namespace RepositoryLayer.Repositories.Interface
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