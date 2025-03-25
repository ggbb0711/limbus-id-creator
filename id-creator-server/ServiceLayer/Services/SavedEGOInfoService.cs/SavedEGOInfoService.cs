using RepositoryLayer.Models;
using RepositoryLayer.Repositories.Interface;
using RepositoryLayer.Utils.Obj;
using RepositoryLayer.Utils.RabbitMQPublisher;
using ServiceLayer.Interfaces.SavedInfoService;
using ServiceLayer.Util;

namespace ServiceLayer.Services.SavedEGOInfoService.cs
{
    public class SavedEGOInfoService(ISavedInfoRepository<SavedEGOInfo,SavedEgo> saveRepository, RabbitMQUploadingImagePublisher publisher) : ISavedInfoService<SavedEGOInfo>
    {
        private readonly ISavedInfoRepository<SavedEGOInfo,SavedEgo> _saveRepository = saveRepository;
        private readonly RabbitMQUploadingImagePublisher _publisher = publisher;
        public async Task<SavedEGOInfo> CreateSavedInfo(SavedEGOInfo newSave, SaveInfoFiles files)
        {
            var uploadingImages= await populateImageField(newSave, files);
            if(Uri.TryCreate(newSave.ImageAttach.Url,UriKind.Absolute, out _)) uploadingImages.Add(newSave.ImageAttach);
            if(Uri.TryCreate(newSave.SavedEgo.SplashArt.Url,UriKind.Absolute, out _)) uploadingImages.Add(newSave.SavedEgo.SplashArt);
            if(Uri.TryCreate(newSave.SavedEgo.SinnerIcon.Url,UriKind.Absolute, out _)) uploadingImages.Add(newSave.SavedEgo.SinnerIcon);
            foreach (var offenseSkill in newSave.SavedEgo.Skill.OffenseSkills)
            {
                if(Uri.TryCreate(offenseSkill.ImageAttach.Url,UriKind.Absolute, out _)) uploadingImages.Add(offenseSkill.ImageAttach);
            }
            foreach (var defenseSkill in newSave.SavedEgo.Skill.DefenseSkills)
            {
                if(Uri.TryCreate(defenseSkill.ImageAttach.Url,UriKind.Absolute, out _)) uploadingImages.Add(defenseSkill.ImageAttach);
            }
            foreach (var customEffect in newSave.SavedEgo.Skill.CustomEffects)
            {
                if(Uri.TryCreate(customEffect.ImageAttach.Url,UriKind.Absolute, out _)) uploadingImages.Add(customEffect.ImageAttach);
            }

            await _saveRepository.CreateNewSave(newSave);
            var newCreatedSaved = await _saveRepository.GetSaved(newSave.Id);
            UploadImageToRabbitMQ(uploadingImages);
            return newCreatedSaved;
        }

        public async Task<SavedEGOInfo?> DeleteSavedInfo(Guid Id)
        {
            return await _saveRepository.DeleteSaved(Id);
        }

        public async Task<SavedEGOInfo?> FindSavedInfoById(Guid Id,bool includeSkill=false)
        {
            return await _saveRepository.GetSaved(Id,includeSkill);
        }

        public async Task<List<SavedEGOInfo>> FindSavedInfos(SearchSaveParams option)
        {
            return await _saveRepository.GetMultiSaved(option);
        }

        public async Task<SavedEGOInfo?> UpdateSavedInfo(SavedEGOInfo newSave,SaveInfoFiles files)
        {
            var uploadingImages = await populateImageField(newSave,files);
            var oldSave = await _saveRepository.GetSaved(newSave.Id,true);
            if(oldSave==null||!oldSave.UserId.Equals(newSave.UserId)) return null;
            //Change the id of the newSave to fit with the old save
            newSave.ImageAttach.Id = oldSave.ImageAttach.Id; 
            if(!oldSave.ImageAttach.Url.Equals(newSave.ImageAttach.Url))
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
            if(oldSave.SavedEgo==null) return null;
            splashArt = newSave.SavedEgo.SplashArt;
            oldSplashArt = oldSave.SavedEgo.SplashArt;

            sinnerIcon = newSave.SavedEgo.SinnerIcon;
            oldSinnerIcon = oldSave.SavedEgo.SinnerIcon;

            //Transfering the old imageId of splashArt/sinnerIcon to the new ones
            savedSkill = newSave.SavedEgo.Skill;
            oldSavedSkill = oldSave.SavedEgo.Skill;


            splashArt.Id = oldSplashArt.Id;
            newSave.SavedEgo.SplashArtId = oldSplashArt.Id;
            sinnerIcon.Id = oldSinnerIcon.Id;
            newSave.SavedEgo.SinnerIconId = oldSinnerIcon.Id;
            if(!oldSplashArt.Url.Equals(splashArt.Url))
            {
                uploadingImages.Add(splashArt);
            }
            if(!oldSinnerIcon.Url.Equals(sinnerIcon.Url))
            {
                uploadingImages.Add(sinnerIcon);
            }
            //Transfering all the old imageId of the skills to the new ones
            for (var i = 0 ;i<savedSkill.OffenseSkills.Count;i++)
            {
                var skill = savedSkill.OffenseSkills.ElementAt(i);
                var oldSkill = oldSavedSkill.OffenseSkills.Where(oldSkill =>oldSkill.Id.Equals(skill.Id)).FirstOrDefault();
                if (oldSkill == null) continue;
                skill.ImageAttach.Id = oldSkill.ImageAttach.Id;
                skill.ImageAttachId = oldSkill.ImageAttachId;
                if(!skill.ImageAttach.Url.Equals(oldSkill.ImageAttach.Url))
                {
                    uploadingImages.Add(skill.ImageAttach);
                }
            }

           for (var i = 0 ;i<savedSkill.DefenseSkills.Count;i++)
            {
                var skill = savedSkill.DefenseSkills.ElementAt(i);
                var oldSkill = oldSavedSkill.DefenseSkills.Where(oldSkill =>oldSkill.Id.Equals(skill.Id)).FirstOrDefault();
                if (oldSkill == null) continue;
                skill.ImageAttach.Id = oldSkill.ImageAttach.Id;
                skill.ImageAttachId = oldSkill.ImageAttachId;
                if(!skill.ImageAttach.Url.Equals(oldSkill.ImageAttach.Url))
                {
                    uploadingImages.Add(skill.ImageAttach);
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
            // Console.WriteLine("Frist offense new skill");
            // Console.WriteLine(newSave.SavedEgo.Skill.OffenseSkills.ElementAt(0).Id);
            // Console.WriteLine("First new offense skill image attach id");
            // Console.WriteLine(newSave.SavedEgo.Skill.OffenseSkills.ElementAt(0).ImageAttach.Id);

            // var oldSkill1 = oldSave.SavedEgo.Skill.OffenseSkills.Where(oldSkill1=>oldSkill1.Id==newSave.SavedEgo.Skill.OffenseSkills.ElementAt(0).Id).FirstOrDefault();
            //  Console.WriteLine("Frist offense old skill");
            // Console.WriteLine(oldSkill1.Id);
            // Console.WriteLine("First old offense skill image attach id");
            // Console.WriteLine(oldSkill1.ImageAttach.Id);
            // Console.WriteLine("New save:");
            // Console.WriteLine(JsonConvert.SerializeObject(newSave.SavedEgo));
            // Console.WriteLine("Old save:");
            // Console.WriteLine(JsonConvert.SerializeObject(oldSave));
            // return null;

            //Update the save
            await _saveRepository.UpdateSaved(new UpdateSaveParams<SavedEgo>()
            {
                UpdateId = newSave.Id,
                Name = newSave.Name,
                SaveTime = newSave.SaveTime,
                ImageAttach = newSave.ImageAttach.Url,
                Saved = newSave.SavedEgo,
            });
            UploadImageToRabbitMQ(uploadingImages);

            return await _saveRepository.GetSaved(newSave.Id);
        }


        //Add in placheholder base64 string for the images
        private async Task<List<ImageObj>> populateImageField(SavedEGOInfo savedInfo, SaveInfoFiles files)
        {
            List<Task> tasks = [];
            List<ImageObj> imageObjs = [];
            var splashArt = savedInfo.SavedEgo?.SplashArt;
            var sinnerIconImgObj = savedInfo.SavedEgo?.SinnerIcon;
            var savedSkill = savedInfo.SavedEgo?.Skill;
           
            if(files.thumbnailImage!=null)
            {
                tasks.Add(FileHelper.ConvertToBase64Async(files.thumbnailImage,url=>{savedInfo.ImageAttach.Url=url;imageObjs.Add(savedInfo.ImageAttach);}));
            }

            if(files.splashArtImg!=null)
            {
                tasks.Add(FileHelper.ConvertToBase64Async(files.splashArtImg,url=>{splashArt.Url=url;imageObjs.Add(splashArt);}));
            }

            if(files.sinnerIcon!=null)
            {
                tasks.Add(FileHelper.ConvertToBase64Async(files.sinnerIcon,url=>{sinnerIconImgObj.Url=url;imageObjs.Add(sinnerIconImgObj);}));
            }

            tasks.AddRange(files.imageIndex.Select((searchIndex, i) => FileHelper.ConvertToBase64Async(files.skillImages[i], url =>
            {
                if (savedSkill == null) return;
                {
                    for (var j = 0; j < savedSkill.OffenseSkills.Count; j++)
                    {
                        if (savedSkill.OffenseSkills.ElementAt(j).Index != searchIndex) continue;
                        savedSkill.OffenseSkills.ElementAt(j).ImageAttach.Url = url;
                        imageObjs.Add(savedSkill.OffenseSkills.ElementAt(j).ImageAttach);
                    }
                    for (var j = 0; j < savedSkill.DefenseSkills.Count; j++)
                    {
                        if (savedSkill.DefenseSkills.ElementAt(j).Index != searchIndex) continue;
                        savedSkill.DefenseSkills.ElementAt(j).ImageAttach.Url = url;
                        imageObjs.Add(savedSkill.DefenseSkills.ElementAt(j).ImageAttach);
                    }
                    for (var j = 0; j < savedSkill.CustomEffects.Count; j++)
                    {
                        if (savedSkill.CustomEffects.ElementAt(j).Index != searchIndex) continue;
                        savedSkill.CustomEffects.ElementAt(j).ImageAttach.Url = url;
                        imageObjs.Add(savedSkill.CustomEffects.ElementAt(j).ImageAttach);
                    }
                }
            })));

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