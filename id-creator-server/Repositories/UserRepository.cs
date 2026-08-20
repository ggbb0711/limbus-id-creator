using Server.Data;
using Server.Models;

namespace Server.Repositories
{
    public class UserRepository(ServerDbContext ctx) : Repository<User>(ctx)
    {
    }
}