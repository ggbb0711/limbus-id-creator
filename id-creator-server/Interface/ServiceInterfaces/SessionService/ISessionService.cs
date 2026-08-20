


using Server.Models;

namespace Server.Interface.ServiceInterface.SessionInterface
{
    public interface ISessionService
    {
        Task<Session?> GetSessionById(Guid sessionId);
        Task<Session> AddSession(Guid userId);
        Task<Session?> DeleteSessionById(Guid sessionId);
        Task<Session?> DeleteSessionByUserId(Guid userId);
        Task<List<Session>> DeleteExpiredSessions();
    }
}