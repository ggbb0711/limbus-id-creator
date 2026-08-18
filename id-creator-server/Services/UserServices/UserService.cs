using Google.Apis.Auth;
using Server.DTOs.Response.Users;
using Server.Interface.Repositories;
using Server.Interface.ServiceInterface.UserService;
using Server.Models;
using Server.Util;

namespace Server.Services
{
    public class UserService(IUserRepository userRepository) : IUserService
    {
        public async Task<User?> GetUser(Guid userId)
        {
            return await userRepository.GetUserById(userId);
        }

        public async Task<User?> GoogleLogin(GoogleJsonWebSignature.Payload googlePayload)
        {
            var user = await userRepository.GetUserByEmail(googlePayload.Email);

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
                
                user = await userRepository.CreateUser(newUser);
            }

            return user;
        }


        public async Task<string?> ChangeUserName(Guid userId,string newName)
        {
            var userChangeProfile = new UserChangeProfileDTO()
            {
                UserIcon="",
                UserName=newName,
            };
            return (await userRepository.ChangeUser(userId, userChangeProfile))?.UserName;
        }

        public async Task<string?> ChangeUserProfile(Guid userId,IFormFile newProfile)
        {
            var newProfileUrl = await FileHelper.ConvertToBase64Async(newProfile);

            var userChangeProfile = new UserChangeProfileDTO()
            {
                UserIcon=newProfileUrl,
                UserName="",
            };
            return (await userRepository.ChangeUser(userId, userChangeProfile))?.UserIcon?.Url;
        }
    }
}