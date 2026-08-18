using Google.Apis.Auth;
using Server.Models;

namespace Server.Interface.ServiceInterface.UserService
{
    public interface IUserService
    {
        Task<User?> GoogleLogin(GoogleJsonWebSignature.Payload loginUser);
        Task<User?> GetUser(Guid userId);
        Task<string?> ChangeUserName(Guid userId,string newName);
        Task<string?> ChangeUserProfile(Guid userId, IFormFile newProfile);
    }
}