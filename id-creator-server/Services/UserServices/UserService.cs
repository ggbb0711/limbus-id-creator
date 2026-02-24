using Server.DTOs.Response.Users;
using Server.Interface.Repositories;
using Server.Interface.ServiceInterface.StaticStorageService;
using Server.Interface.ServiceInterface.UserService;
using Server.Models;
using Server.Util;

namespace Server.Services
{
    public class UserService:IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly ISessionRepository _sessionRepository;

        public UserService(IUserRepository userRepository, ISessionRepository sessionRepository)
        {
            _userRepository = userRepository;
            _sessionRepository = sessionRepository;
        }

        public async Task<User?> GetUser(Guid userId)
        {
            return await _userRepository.GetUserById(userId);
        }

        public async Task<User> Login(UserOAuthReponse loginUser)
        {
            var user = await _userRepository.GetUserByEmail(loginUser.email);

            if(user ==null)
            {
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
                
                user = await _userRepository.CreateUser(newUser);
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
            return (await _userRepository.ChangeUser(userId, userChangeProfile))?.UserName;
        }

        public async Task<string?> ChangeUserProfile(Guid userId,IFormFile newProfile)
        {
            var newProfileUrl = await FileHelper.ConvertToBase64Async(newProfile);

            var userChangeProfile = new UserChangeProfileDTO()
            {
                UserIcon=newProfileUrl,
                UserName="",
            };
            return (await _userRepository.ChangeUser(userId, userChangeProfile))?.UserIcon?.Url;
        }
    }
}