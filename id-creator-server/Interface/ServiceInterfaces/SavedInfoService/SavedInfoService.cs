using Server.Models;
using Server.Util.Obj;

namespace Server.Interface.ServiceInterface.SavedInfoService
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