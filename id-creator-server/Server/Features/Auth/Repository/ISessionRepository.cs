

using Server.Shared.Model;
using Server.Shared.Repository;

namespace Server.Features.Auth.Repository
{
    public interface ISessionRepository : IRepository<Session>
    {
        Task<List<Session>> DeleteExpiredSessions();
    }
}
