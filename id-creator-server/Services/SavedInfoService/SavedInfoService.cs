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
            if(oldSave==null||!oldSave.UserId.Equals(newSave.UserId)) return null;
            newSave.ImageAttach.Id = oldSave.ImageAttach.Id;
            
            //Change splashArt, sinnerIcon and savedSkill
            //TODO Implement a method to delete old images
            ImageObj splashArt;
            ImageObj oldSplashArt;
            ImageObj sinnerIcon;
            ImageObj oldSinnerIcon;
            SavedSkill savedSkill;
            SavedSkill oldSavedSkill;
            if(oldSave.Saved==null) return null;
            splashArt = newSave.Saved.SplashArt;
            oldSplashArt = oldSave.Saved.SplashArt;

            sinnerIcon = newSave.Saved.SinnerIcon;
            oldSinnerIcon = oldSave.Saved.SinnerIcon;

            //Transfering the old imageId of splashArt/sinnerIcon to the new ones
            savedSkill = newSave.Saved.Skill;
            oldSavedSkill = oldSave.Saved.Skill;


            splashArt.Id = oldSplashArt.Id;
            newSave.Saved.SplashArtId = oldSplashArt.Id;
            sinnerIcon.Id = oldSinnerIcon.Id;
            newSave.Saved.SinnerIconId = oldSinnerIcon.Id;

            //Transfering all the old imageId of the skills to the new ones
            for (int i = 0 ;i<savedSkill.OffenseSkills.Count;i++)
            {
                var skill = savedSkill.OffenseSkills.ElementAt(i);
                var oldSkill = oldSavedSkill.OffenseSkills.Where(oldSkill =>oldSkill.Id.Equals(skill.Id)).FirstOrDefault();
                if(oldSkill != null)
                {
                    skill.ImageAttach.Id = oldSkill.ImageAttach.Id;
                    skill.ImageAttachId = oldSkill.ImageAttachId;
                }
            }

            for (int i = 0 ;i<savedSkill.DefenseSkills.Count;i++)
            {
                var skill = savedSkill.DefenseSkills.ElementAt(i);
                var oldSkill = oldSavedSkill.DefenseSkills.Where(oldSkill =>oldSkill.Id.Equals(skill.Id)).FirstOrDefault();
                if(oldSkill != null)
                {
                    skill.ImageAttach.Id = oldSkill.ImageAttach.Id;
                    skill.ImageAttachId = oldSkill.ImageAttachId;
                }
            }

            for (int i = 0 ;i<savedSkill.CustomEffects.Count;i++)
            {
                var skill = savedSkill.CustomEffects.ElementAt(i);
                var oldSkill = oldSavedSkill.CustomEffects.Where(oldSkill =>oldSkill.Id.Equals(skill.Id)).FirstOrDefault();
                if(oldSkill != null)
                {
                    skill.ImageAttach.Id = oldSkill.ImageAttach.Id;
                    skill.ImageAttachId = oldSkill.ImageAttachId;
                }
            }

            //Update the save
            await _saveRepository.UpdateAsync(newSave);
            await _savedSkillRepository.UpdateSavedSkill(newSave.Saved.Skill);
            await _saveRepository.SaveChangeAsync();
            var updatedSave = await _saveRepository.GetByIdAsync(newSave.Id);
            if(updatedSave!=null) newSave.ImageAttach.LastUpdated = updatedSave.ImageAttach.LastUpdated;
            return updatedSave;
        }


        //Add in placheholder base64 string for the images
        private static async Task<List<ImageObj>> PopulateImageField(TEntry savedInfo, SaveInfoFilesRequestDTO files)
        {
            List<Task> tasks = [];
            List<ImageObj> imageObjs = [];
            var splashArt = savedInfo.Saved.SplashArt;
            var sinnerIconImgObj = savedInfo.Saved.SinnerIcon;
            var savedSkill = savedInfo.Saved.Skill;

            if(files.ThumbnailImage!=null)
            {
                tasks.Add(FileHelper.ConvertToBase64Async(files.ThumbnailImage,url=>{savedInfo.ImageAttach.Url=url;imageObjs.Add(savedInfo.ImageAttach);}));
            }

            if(files.SplashArtImg!=null)
            {
                tasks.Add(FileHelper.ConvertToBase64Async(files.SplashArtImg,url=>{splashArt.Url=url;imageObjs.Add(splashArt);}));
            }

            if(files.SinnerIcon!=null)
            {
                tasks.Add(FileHelper.ConvertToBase64Async(files.SinnerIcon,url=>{sinnerIconImgObj.Url=url;imageObjs.Add(sinnerIconImgObj);}));
            }
            foreach(var entry in files.SkillImages)
            {
                var searchIndex = entry.Index;
                tasks.Add(FileHelper.ConvertToBase64Async(entry.Image,url=>
                {
                    for(int j = 0 ;j<savedSkill.OffenseSkills.Count;j++)
                    {
                        if(savedSkill.OffenseSkills.ElementAt(j).Index==searchIndex)
                        {
                            savedSkill.OffenseSkills.ElementAt(j).ImageAttach.Url = url;
                            imageObjs.Add(savedSkill.OffenseSkills.ElementAt(j).ImageAttach);
                        }
                    }
                    for(int j = 0 ;j<savedSkill.DefenseSkills.Count;j++)
                    {
                        if(savedSkill.DefenseSkills.ElementAt(j).Index==searchIndex)
                        { 
                            savedSkill.DefenseSkills.ElementAt(j).ImageAttach.Url = url;
                            imageObjs.Add(savedSkill.DefenseSkills.ElementAt(j).ImageAttach);
                        }
                    }
                    for(int j = 0 ;j<savedSkill.CustomEffects.Count;j++)
                    {
                        if(savedSkill.CustomEffects.ElementAt(j).Index==searchIndex)
                        {
                            savedSkill.CustomEffects.ElementAt(j).ImageAttach.Url = url;
                            imageObjs.Add(savedSkill.CustomEffects.ElementAt(j).ImageAttach);
                        }
                    }
                }));
            }

            await Task.WhenAll([.. tasks]);
            return imageObjs;
        }
    } 
}