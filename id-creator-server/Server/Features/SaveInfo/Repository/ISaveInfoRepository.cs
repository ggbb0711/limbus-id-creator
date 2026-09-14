
using Server.Shared.Model.Interface;
using Server.Shared.Repository;

namespace Server.Features.SaveInfo.Repository
{
    public interface ISaveInfoRepository<TEntry,TPayload>:IRepository<TEntry>
        where TEntry : class, ISavedEntry<TPayload>
        where TPayload : class, ISavedPayload
    {
        Task MergeSavedInfo(TEntry tracked, TEntry incoming);
        Task<TEntry?> GetByIdAsyncIncludingSaved(Guid id);
    }
}
