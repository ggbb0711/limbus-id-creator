using Server.Shared.Database;
using Server.Shared.Repository;

namespace Server.Features.User.Repository
{
    public class UserRepository(ServerDbContext ctx) : Repository<UserModel>(ctx),IUserRepository
    {
    }
}
