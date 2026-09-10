
using Server.Interface.UtilInterfaces;

namespace Server.Interface.Repositories
{
    public interface ISaveInfoRepository<TEntry,TPayload>:IRepository<TEntry>
        where TEntry : class, ISavedEntry<TPayload>
        where TPayload : class, ISavedPayload
    {
        Task MergeSavedInfo(TEntry tracked, TEntry incoming);
        Task<TEntry?> GetByIdAsyncIncludingSaved(Guid id);
    }
}