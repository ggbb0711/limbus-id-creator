using System.Globalization;
using Server.Data;
using Server.Interface.Repositories;

namespace Server.Repositories
{
    public abstract class SavedInfoRepositoryBase<IInfo, TSave>(ServerDbContext ctx):ISavedInfoRepository<TextInfo, TSave>
    {
        public async Task<IInfo?> DeleteSaved(Guid id)
        {
            
        }
    }
}