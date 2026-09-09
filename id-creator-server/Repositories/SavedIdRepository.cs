using Server.Data;
using Server.Interface.Repositories;
using Server.Models;

namespace Server.Repositories
{
    public class SavedIdRepository(ServerDbContext ctx) : Repository<SavedId>(ctx), ISavedIdRepository
    {
    }
}
