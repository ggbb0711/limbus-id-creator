using Server.DTOs.Response.Users;
using Server.Interface.Repositories;
using Server.Interface.ServiceInterface.UploadService;
using Server.Interface.ServiceInterface.UserService;
using Server.Models;
using Server.Services.UtilServices;
using Server.Util;

namespace Server.Services
{
    public class UserService:IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IUploadService _cloudinaryUploadService;
        private readonly JobQueue _jobQueue;
        private readonly IServiceScopeFactory _serviceProvider;

        public UserService(IUserRepository userRepository,IUploadService cloudinaryUploadService,JobQueue jobQueue, IServiceScopeFactory serviceScopeFactory)
        {
            _userRepository = userRepository;
            _cloudinaryUploadService = cloudinaryUploadService;
            JobQueue _jobQueue = jobQueue;
            IServiceScopeFactory _serviceScopeFactory = serviceScopeFactory;
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
                var newUser = new User()
                {
                    Id = Guid.NewGuid(),
                    UserEmail = loginUser.email,
                    UserName = loginUser.name,
                    UserIcon = loginUser.picture,
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

            // Schedule the file upload in the background
            _jobQueue.Enqueue(async Task() =>
            {
                var uploadUrl = await _cloudinaryUploadService.Upload(newProfile, userId + "_user_icon.jpg");
                using(var scope = _serviceProvider.CreateScope())
                {
                    var userService = scope.ServiceProvider.GetRequiredService<IUserService>();
                    await _userRepository.ChangeUser(userId,new UserChangeProfileDTO()
                    {
                        UserIcon = uploadUrl,
                        UserName=""
                    });
                }
            });
            var userChangeProfile = new UserChangeProfileDTO()
            {
                UserIcon=newProfileUrl,
                UserName="",
            };
            return (await _userRepository.ChangeUser(userId, userChangeProfile))?.UserIcon;
        }
    }
}