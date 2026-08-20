using Google.Apis.Auth;
using Microsoft.IdentityModel.Tokens;
using Server.DTOs.Request.User;
using Server.Interface.Repositories;
using Server.Interface.ServiceInterface.UserService;
using Server.Models;
using Server.Util;
using Server.Util.Obj;
using Server.Util.RabbitMQPublisher;

namespace Server.Services
{
    public class UserService(IUserRepository userRepository, RabbitMQUploadingImagePublisher publisher) : IUserService
    {
        public async Task<User?> GetUserById(Guid userId)
        {
            return await userRepository.GetByIdAsync(userId);
        }

        public async Task<User?> Login(GoogleJsonWebSignature.Payload googlePayload)
        {
            var user = (await userRepository.FindAsync(new RepositoryGetParams<User>()
            {
                Filter = u => u.UserEmail == googlePayload.Email
            })).FirstOrDefault();

            if(user != null && (!user.IsActive || user.IsRemoved)) return null;

            if(user ==null)
            {
                var imageId = new Guid();
                var newUser = new User()
                {
                    Id = Guid.NewGuid(),
                    UserEmail = googlePayload.Email,
                    UserName = googlePayload.Name,
                    UserIconId = imageId,
                    UserIcon = new ImageObj(){
                        Id = imageId,
                        Url = googlePayload.Picture,
                    },
                    CreatedAt = DateTime.Now,
                };
                
                user = await userRepository.AddAsync(newUser);
                await userRepository.SaveChangeAsync();
            }

            return user;
        }

        public async Task<User?> UpdateUser(Guid userId, UpdateUserProfileDTO updateUserProfileDTO)
        {
            var updatedUser = await userRepository.GetByIdAsync(userId);
            if(updatedUser == null) return null;

            if(!updateUserProfileDTO.UserName.IsNullOrEmpty()) updatedUser.UserName = updateUserProfileDTO.UserName;
            if(updateUserProfileDTO.UserIconFile != null)
            {
                publisher.PushFormFileToRabbitMQ(updatedUser.UserIcon.Id, updateUserProfileDTO.UserIconFile, updatedUser.UserIcon.LastUpdated);
                var iconUrl = await FileHelper.ConvertToBase64Async(updateUserProfileDTO.UserIconFile);
                updatedUser.UserIcon.Url = iconUrl;
                updatedUser.UserIcon.LastUpdated = DateTime.Now;
            }
            
            var newUser = await userRepository.UpdateAsync(updatedUser);
            await userRepository.SaveChangeAsync();
            return newUser;
        }

    }
}