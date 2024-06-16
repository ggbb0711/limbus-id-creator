


using Server.DTOs.Response.Users;
using Server.Models;

namespace Server.Interface.ServiceInterface.UserService
{
    public interface IUserService
    {
        Task<User> Login(UserOAuthReponse loginUser);
        Task<User?> GetUser(Guid userId);
        Task<string?> ChangeUserName(Guid userId,string newName);
        Task<string?> ChangeUserProfile(Guid userId, IFormFile newProfile);
    }
}