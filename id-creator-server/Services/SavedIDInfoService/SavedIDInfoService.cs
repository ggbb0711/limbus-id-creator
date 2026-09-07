using Server.DTOs.Requests.SavedInfo;
using Server.Interface.Repositories;
using Server.Interface.ServiceInterface.SavedInfoService;
using Server.Models;
using Server.Util;
using Server.Util.Obj;
using Server.Util.RabbitMQPublisher;

namespace Server.Services.SavedInfoService
{
    public class SavedIDInfoService(ISavedInfoRepository<SavedIDInfo,SavedId> saveRepository, RabbitMQUploadingImagePublisher publisher) : ISavedInfoService<SavedIDInfo>
    {
        private readonly ISavedInfoRepository<SavedIDInfo,SavedId> _saveRepository = saveRepository;
        private readonly RabbitMQUploadingImagePublisher _publisher = publisher;
        public async Task<SavedIDInfo> CreateSavedInfo(SavedIDInfo newSave, SaveInfoFilesRequestDTO files)
        {
            var uploadingImages= await PopulateImageField(newSave, files);
            if(Uri.TryCreate(newSave.ImageAttach.Url,UriKind.Absolute, out _)) uploadingImages.Add(newSave.ImageAttach);
            if(Uri.TryCreate(newSave.SavedId.SplashArt.Url,UriKind.Absolute, out _)) uploadingImages.Add(newSave.SavedId.SplashArt);
            if(Uri.TryCreate(newSave.SavedId.SinnerIcon.Url,UriKind.Absolute, out _)) uploadingImages.Add(newSave.SavedId.SinnerIcon);
            foreach (var offenseSkill in newSave.SavedId.Skill.OffenseSkills)
            {
                if(Uri.TryCreate(offenseSkill.ImageAttach.Url,UriKind.Absolute, out _)) uploadingImages.Add(offenseSkill.ImageAttach);
            }
            foreach (var defenseSkill in newSave.SavedId.Skill.DefenseSkills)
            {
                if(Uri.TryCreate(defenseSkill.ImageAttach.Url,UriKind.Absolute, out _)) uploadingImages.Add(defenseSkill.ImageAttach);
            }
            foreach (var customEffect in newSave.SavedId.Skill.CustomEffects)
            {
                if(Uri.TryCreate(customEffect.ImageAttach.Url,UriKind.Absolute, out _)) uploadingImages.Add(customEffect.ImageAttach);
            }

            await _saveRepository.CreateNewSave(newSave);
            var newCreatedSaved = await _saveRepository.GetSaved(newSave.Id);
            UploadImageToRabbitMQ(uploadingImages);
            return newCreatedSaved;
        }

        public async Task<SavedIDInfo?> DeleteSavedInfo(Guid Id)
        {
            return await _saveRepository.DeleteSaved(Id);
        }

        public async Task<SavedIDInfo?> FindSavedInfoById(Guid Id,bool includeSkill=false)
        {
            return await _saveRepository.GetSaved(Id,includeSkill);
        }

        public async Task<List<SavedIDInfo>> FindSavedInfos(SearchSaveParams option)
        {
            return await _saveRepository.GetMultiSaved(option);
        }

        public async Task<SavedIDInfo?> UpdateSavedInfo(SavedIDInfo newSave,SaveInfoFilesRequestDTO files)
        {
            var uploadingImages = await PopulateImageField(newSave,files);
            var oldSave = await _saveRepository.GetSaved(newSave.Id,true);
            if(oldSave==null||!oldSave.UserId.Equals(newSave.UserId)) return null;
            //Change the id of the newSave to fit with the old save
            newSave.ImageAttach.Id = oldSave.ImageAttach.Id;
            if(!oldSave.ImageAttach.Url.Equals(newSave.ImageAttach.Url) && !uploadingImages.Contains(newSave.ImageAttach))
            {
                uploadingImages.Add(newSave.ImageAttach);
            }
            
            //Change splashArt, sinnerIcon and savedSkill
            //TODO Implement a method to delete old images
            ImageObj splashArt;
            ImageObj oldSplashArt;
            ImageObj sinnerIcon;
            ImageObj oldSinnerIcon;
            SavedSkill savedSkill;
            SavedSkill oldSavedSkill;
            if(oldSave.SavedId==null) return null;
            splashArt = newSave.SavedId.SplashArt;
            oldSplashArt = oldSave.SavedId.SplashArt;

            sinnerIcon = newSave.SavedId.SinnerIcon;
            oldSinnerIcon = oldSave.SavedId.SinnerIcon;

            //Transfering the old imageId of splashArt/sinnerIcon to the new ones
            savedSkill = newSave.SavedId.Skill;
            oldSavedSkill = oldSave.SavedId.Skill;


            splashArt.Id = oldSplashArt.Id;
            newSave.SavedId.SplashArtId = oldSplashArt.Id;
            sinnerIcon.Id = oldSinnerIcon.Id;
            newSave.SavedId.SinnerIconId = oldSinnerIcon.Id;
            if(!oldSplashArt.Url.Equals(splashArt.Url))
            {
                uploadingImages.Add(splashArt);
            }
            if(!oldSinnerIcon.Url.Equals(sinnerIcon.Url))
            {
                uploadingImages.Add(sinnerIcon);
            }
            //Transfering all the old imageId of the skills to the new ones
            for (int i = 0 ;i<savedSkill.OffenseSkills.Count;i++)
            {
                var skill = savedSkill.OffenseSkills.ElementAt(i);
                var oldSkill = oldSavedSkill.OffenseSkills.Where(oldSkill =>oldSkill.Id.Equals(skill.Id)).FirstOrDefault();
                if(oldSkill != null)
                {
                    skill.ImageAttach.Id = oldSkill.ImageAttach.Id;
                    skill.ImageAttachId = oldSkill.ImageAttachId;
                    if(!skill.ImageAttach.Url.Equals(oldSkill.ImageAttach.Url))
                    {
                        uploadingImages.Add(skill.ImageAttach);
                    }
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
                    if(!skill.ImageAttach.Url.Equals(oldSkill.ImageAttach.Url))
                    {
                        uploadingImages.Add(skill.ImageAttach);
                    }
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
                    if(!skill.ImageAttach.Url.Equals(oldSkill.ImageAttach.Url))
                    {
                        uploadingImages.Add(skill.ImageAttach);
                    }
                }
            }

            //Update the save
            var updatedSave = await _saveRepository.UpdateSaved(new UpdateSaveParams<SavedId>()
            {
                UpdateId = newSave.Id,
                Name = newSave.Name,
                SaveTime = newSave.SaveTime,
                ImageAttach = newSave.ImageAttach.Url,
                Saved = newSave.SavedId,
            });
            if(updatedSave!=null) newSave.ImageAttach.LastUpdated = updatedSave.ImageAttach.LastUpdated;
            UploadImageToRabbitMQ(uploadingImages);

            return await _saveRepository.GetSaved(newSave.Id);
        }


        //Add in placheholder base64 string for the images
        private static async Task<List<ImageObj>> PopulateImageField(SavedIDInfo savedInfo, SaveInfoFilesRequestDTO files)
        {
            List<Task> tasks = [];
            List<ImageObj> imageObjs = [];
            var splashArt = savedInfo.SavedId?.SplashArt;
            var sinnerIconImgObj = savedInfo.SavedId?.SinnerIcon;
            var savedSkill = savedInfo.SavedId?.Skill;

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

            await Task.WhenAll(tasks.ToArray());
            return imageObjs;
        }

        private void UploadImageToRabbitMQ(List<ImageObj> imageObjs)
        {
            imageObjs.ForEach(image =>
            { 
                if(FileHelper.IsBase64String(image.Url.Replace("data:image/png;base64,","")))_publisher.PushBase64StringToRabbitMQ(image.Id,image.Url.Replace("data:image/png;base64,",""),image.LastUpdated);
                else if(Uri.TryCreate(image.Url, UriKind.Absolute, out _)) _publisher.PushURLStringToRabbitMQ(image.Id, image.Url, image.LastUpdated);
            });
        }

    }
}