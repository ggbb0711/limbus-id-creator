



using Server.Interface.Repositories;
using Server.Interface.ServiceInterface.SavedInfoService;
using Server.Models;
using Server.Util.Obj;

namespace Server.Services.SavedInfoService
{
    public class SavedInfoService(ISavedInfoRepository saveRepository) : ISavedInfoService
    {
        private readonly ISavedInfoRepository _saveRepository = saveRepository;
        public async Task<SavedInfo> CreateSavedInfo(SavedInfo newSave)
        {
            await _saveRepository.CreateNewSave(newSave);

            return newSave;
        }

        public Task<SavedInfo?> DeleteSavedInfo(Guid Id)
        {
            throw new NotImplementedException();
        }

        public Task<SavedInfo?> FindSavedInfo(Guid Id)
        {
            throw new NotImplementedException();
        }

        public Task<SavedInfo?> UpdateSavedInfo(UpdateSaveParams newSave)
        {
            throw new NotImplementedException();
        }
    }
}