
using Server.Interface.UtilInterfaces;

namespace Server.Interface.Repositories
{
    public interface ISaveInfoRepository<TEntry,TPayload>:IRepository<TEntry>
        where TEntry : class, ISavedEntry<TPayload>
        where TPayload : class, ISavedPayload
    {
        new Task UpdateAsync(TEntry entity);
        Task<TEntry?> GetByIdAsyncIncludingSaved(Guid id);
    }
}