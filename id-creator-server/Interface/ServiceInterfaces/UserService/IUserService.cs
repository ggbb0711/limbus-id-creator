using Google.Apis.Auth;
using Server.DTOs.Request.User;
using Server.Models;

namespace Server.Interface.ServiceInterface.UserService
{
    public interface IUserService
    {
        Task<User?> Login(GoogleJsonWebSignature.Payload loginUser);
        Task<User?> GetUserById(Guid userId);
        Task<User?> UpdateUser(Guid userId,UpdateUserProfileDTO updateUserProfileDTO);
    }
}