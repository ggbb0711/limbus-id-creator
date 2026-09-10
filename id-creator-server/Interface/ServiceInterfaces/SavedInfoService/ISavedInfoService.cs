using Server.DTOs.Requests.SavedInfo;
using Server.Interface.UtilInterfaces;
using Server.Util.Obj;

namespace Server.Interface.ServiceInterface.SavedInfoService
{
    public interface ISavedInfoService<SaveEntry, SavePayload> 
    where SaveEntry : ISavedEntry<SavePayload>
    where SavePayload: ISavedPayload
    {
        Task<SaveEntry> CreateSavedInfo(SaveEntry newSave, SaveInfoFilesRequestDTO files);
        Task<SaveEntry?> FindSavedInfoById(Guid Id,bool includeSkill=false);
        Task<List<SaveEntry>> FindSavedInfos(SearchSaveParams option);
        Task<SaveEntry?> UpdateSavedInfo(SaveEntry newSave, SaveInfoFilesRequestDTO files);
        Task<SaveEntry?> DeleteSavedInfo(Guid Id);
    }
}