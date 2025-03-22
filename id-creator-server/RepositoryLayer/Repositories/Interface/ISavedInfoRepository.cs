using RepositoryLayer.Utils.Obj;

namespace RepositoryLayer.Repositories.Interface
{
    public interface ISavedInfoRepository<SavedInfo,SaveType>
    {
        Task<SavedInfo> CreateNewSave(SavedInfo newSave);
        Task<SavedInfo?> GetSaved(Guid id,bool includeSkill=false);
        Task<List<SavedInfo>> GetMultiSaved(SearchSaveParams option);
        Task<SavedInfo?> UpdateSaved(UpdateSaveParams<SaveType> newID);
        Task<SavedInfo?> DeleteSaved(Guid id);
    }
}