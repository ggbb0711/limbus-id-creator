using Microsoft.AspNetCore.Http;
using RepositoryLayer.Models;
using RepositoryLayer.Repositories.Interface;
using RepositoryLayer.Utils.Obj;
using ServiceLayer.DTOs.Response.Users;
using ServiceLayer.Interfaces.UserService;
using ServiceLayer.Util;

namespace ServiceLayer.Services.UserServices
{
    public class UserService(IUserRepository userRepository, ISessionRepository sessionRepository)
        : IUserService
    {
        private readonly ISessionRepository _sessionRepository = sessionRepository;

        public async Task<User?> GetUser(Guid userId)
        {
            return await userRepository.GetUserById(userId);
        }

        public async Task<User> Login(UserOAuthReponse loginUser)
        {
            var user = await userRepository.GetUserByEmail(loginUser.email);

            if (user != null) return user;
            var imageId = new Guid();
            var newUser = new User()
            {
                Id = Guid.NewGuid(),
                UserEmail = loginUser.email,
                UserName = loginUser.name,
                UserIconId = imageId,
                UserIcon = new ImageObj(){
                    Id = imageId,
                    Url = loginUser.picture,
                },
                CreatedAt = DateTime.Now,
            };
                
            user = await userRepository.CreateUser(newUser);

            return user;
        }


        public async Task<string?> ChangeUserName(Guid userId,string newName)
        {
            var userChangeProfile = new UserChangeProfileDTO()
            {
                UserIcon="",
                UserName=newName,
            };
            return (await UpdateUserProfile(userId, userChangeProfile))?.UserName;
        }

        public async Task<string?> ChangeUserProfile(Guid userId,IFormFile newProfile)
        {
            var newProfileUrl = await FileHelper.ConvertToBase64Async(newProfile);

            var userChangeProfile = new UserChangeProfileDTO()
            {
                UserIcon=newProfileUrl,
                UserName="",
            };
            return (await UpdateUserProfile(userId, userChangeProfile))?.UserIcon?.Url;
        }
        
        public async Task<User?> UpdateUserProfile(Guid id, UserChangeProfileDTO userChangeProfile)
        {
            var foundUser = await userRepository.GetUserById(id);

            if (foundUser == null) return foundUser;
            if (!String.IsNullOrEmpty(userChangeProfile.UserName))
            {
                foundUser.UserName = userChangeProfile.UserName;
            }
            if(!String.IsNullOrEmpty(userChangeProfile.UserIcon))
            {
                foundUser.UserIcon.Url = userChangeProfile.UserIcon;
                foundUser.UserIcon.LastUpdated = DateTime.Now;
            }
            await userRepository.UpdateUser(foundUser);
            return foundUser;
        }
        
        
    }
}