using Server.Models;
using Server.Util.Obj;

namespace Server.Interface.ServiceInterface.SavedInfoService
{
    public interface ISavedInfoService
    {
        Task<SavedInfo> CreateSavedInfo(SavedInfo newSave);
        Task<SavedInfo?> FindSavedInfo(Guid Id);
        Task<SavedInfo?> UpdateSavedInfo(UpdateSaveParams newSave);
        Task<SavedInfo?> DeleteSavedInfo(Guid Id);
    }
}