using Server.DTOs.Requests.SavedInfo;
using Server.Interface.Repositories;
using Server.Interface.ServiceInterface.SavedInfoService;
using Server.Interface.UtilInterfaces;
using Server.Models;
using Server.Util;
using Server.Util.Obj;

namespace Server.Services.SavedInfoService
{
    public class SavedInfoService<TEntry, TPayload>(
        ISaveInfoRepository<TEntry,TPayload> saveRepository,
        ISavedSkillRepository savedSkillRepository
    ) : ISavedInfoService<TEntry,TPayload>
        where TEntry : class, ISavedEntry<TPayload>
        where TPayload : class, ISavedPayload
    {
        private readonly ISaveInfoRepository<TEntry,TPayload> _saveRepository = saveRepository;
        private readonly ISavedSkillRepository _savedSkillRepository = savedSkillRepository;
        public async Task<TEntry> CreateSavedInfo(TEntry newSave, SaveInfoFilesRequestDTO files)
        {
            await PopulateImageField(newSave, files);
            var newCreatedSaved = await _saveRepository.AddAsync(newSave);
            await _saveRepository.SaveChangeAsync();
            return newCreatedSaved;
        }

        public async Task<TEntry?> DeleteSavedInfo(Guid Id)
        {
            var deleteSave = await _saveRepository.GetByIdAsync(Id);
            if(deleteSave != null)
            {
                await _saveRepository.RemoveAsync(deleteSave);
                await _saveRepository.SaveChangeAsync();
            }
            return deleteSave;
        }

        public async Task<TEntry?> FindSavedInfoById(Guid Id,bool includeSkill=false)
        {
            if(includeSkill) return await _saveRepository.GetByIdAsyncIncludingSaved(Id);
            return await _saveRepository.GetByIdAsync(Id);
        }

        public async Task<List<TEntry>> FindSavedInfos(SearchSaveParams option)
        {
            return [.. await _saveRepository.FindAsync(new RepositoryGetParams<TEntry>()
            {
                Filter = s => s.Name.Contains(option.Name) && s.UserId == option.UserId,
                OrderBy = q => q.OrderByDescending(s=>s.SaveTime),
                Skip = option.Page * option.Limit,
                Take = option.Limit,
            })];
        }

        public async Task<TEntry?> UpdateSavedInfo(TEntry newSave,SaveInfoFilesRequestDTO files)
        {
            await PopulateImageField(newSave,files);
            var oldSave = await _saveRepository.GetByIdAsyncIncludingSaved(newSave.Id);
            if(oldSave?.Saved==null||!oldSave.UserId.Equals(newSave.UserId)) return null;

            var oldSaved = oldSave.Saved;
            var newSaved = newSave.Saved;

            TransferImageId(newSave.ImageAttach, oldSave.ImageAttach);
            TransferImageId(newSaved.SplashArt, oldSaved.SplashArt);
            newSaved.SplashArtId = oldSaved.SplashArt.Id;
            TransferImageId(newSaved.SinnerIcon, oldSaved.SinnerIcon);
            newSaved.SinnerIconId = oldSaved.SinnerIcon.Id;

            TransferSkillImageIds(newSaved.Skill.OffenseSkills, oldSaved.Skill.OffenseSkills);
            TransferSkillImageIds(newSaved.Skill.DefenseSkills, oldSaved.Skill.DefenseSkills);
            TransferSkillImageIds(newSaved.Skill.CustomEffects, oldSaved.Skill.CustomEffects);

            //Update the save
            await _saveRepository.MergeSavedInfo(oldSave, newSave);
            await _savedSkillRepository.UpdateSavedSkill(oldSaved.Skill, newSaved.Skill);
            await _saveRepository.SaveChangeAsync();
            return oldSave;
        }

        private static void TransferImageId(ImageObj newImg, ImageObj oldImg) => newImg.Id = oldImg.Id;

        private static void TransferSkillImageIds<T>(IEnumerable<T> newSkills, IEnumerable<T> oldSkills)
            where T : ISkill, IImageAttach
        {
            foreach(var skill in newSkills)
            {
                var oldSkill = oldSkills.FirstOrDefault(o => o.Id.Equals(skill.Id));
                if(oldSkill == null) continue;
                skill.ImageAttach.Id = oldSkill.ImageAttach.Id;
                skill.ImageAttachId = oldSkill.ImageAttachId;
            }
        }


        //Add in placheholder base64 string for the images
        private static async Task PopulateImageField(TEntry savedInfo, SaveInfoFilesRequestDTO files)
        {
            List<Task> tasks = [];
            var splashArt = savedInfo.Saved.SplashArt;
            var sinnerIconImgObj = savedInfo.Saved.SinnerIcon;
            var savedSkill = savedInfo.Saved.Skill;

            if(files.ThumbnailImage!=null)
            {
                tasks.Add(FileHelper.ConvertToBase64Async(files.ThumbnailImage,url=>{savedInfo.ImageAttach.Url=url;}));
            }

            if(files.SplashArtImg!=null)
            {
                tasks.Add(FileHelper.ConvertToBase64Async(files.SplashArtImg,url=>{splashArt.Url=url;}));
            }

            if(files.SinnerIcon!=null)
            {
                tasks.Add(FileHelper.ConvertToBase64Async(files.SinnerIcon,url=>{sinnerIconImgObj.Url=url;}));
            }
            foreach(var entry in files.SkillImages)
            {
                var searchIndex = entry.Index;
                tasks.Add(FileHelper.ConvertToBase64Async(entry.Image,url=>
                {
                    for(int j = 0 ;j<savedSkill.OffenseSkills.Count;j++)
                        if(savedSkill.OffenseSkills.ElementAt(j).Index==searchIndex)
                            savedSkill.OffenseSkills.ElementAt(j).ImageAttach.Url = url;
                    for(int j = 0 ;j<savedSkill.DefenseSkills.Count;j++)
                        if(savedSkill.DefenseSkills.ElementAt(j).Index==searchIndex)
                            savedSkill.DefenseSkills.ElementAt(j).ImageAttach.Url = url;
                    for(int j = 0 ;j<savedSkill.CustomEffects.Count;j++)
                        if(savedSkill.CustomEffects.ElementAt(j).Index==searchIndex)
                            savedSkill.CustomEffects.ElementAt(j).ImageAttach.Url = url;
                }));
            }

            await Task.WhenAll([.. tasks]);
        }
    } 
}