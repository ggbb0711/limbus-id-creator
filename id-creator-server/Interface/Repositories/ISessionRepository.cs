

using Server.Models;

namespace Server.Interface.Repositories
{
    public interface ISessionRepository : IRepository<Session>
    {
        Task<List<Session>> DeleteExpiredSessions();
    }
}