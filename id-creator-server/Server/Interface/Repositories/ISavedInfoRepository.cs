

using Server.Models;
using Server.Util.Obj;

namespace Server.Interface.Repositories
{
    public interface ISavedInfoRepository
    {
        Task<SavedInfo> CreateNewSave(SavedInfo newSave);
        Task<SavedInfo?> GetSaved(Guid id,bool isPublic);
        Task<List<SavedInfo>> GetMultiSaved(SearchSaveParams option);
        Task<SavedInfo?> UpdateSaved(Guid id,UpdateSaveParams newID);
        Task<SavedInfo?> DeleteSaved(Guid id);
    }
}