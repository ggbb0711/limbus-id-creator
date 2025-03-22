using RepositoryLayer.Utils.Obj;

namespace ServiceLayer.Interfaces.SavedInfoService
{
    public interface ISavedInfoService<SavedInfo>
    {
        Task<SavedInfo> CreateSavedInfo(SavedInfo newSave, SaveInfoFiles files);
        Task<SavedInfo?> FindSavedInfoById(Guid Id,bool includeSkill=false);
        Task<List<SavedInfo>> FindSavedInfos(SearchSaveParams option);
        Task<SavedInfo?> UpdateSavedInfo(SavedInfo newSave, SaveInfoFiles files);
        Task<SavedInfo?> DeleteSavedInfo(Guid Id);
    }
}