using Server.Features.SaveInfo.DTO;
using Server.Features.SaveInfo.Repository;
using Server.Shared.Model.Interface;

namespace Server.Features.SaveInfo.Service
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
