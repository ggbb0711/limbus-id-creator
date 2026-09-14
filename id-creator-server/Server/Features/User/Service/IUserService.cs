using Google.Apis.Auth;
using Server.Features.User.DTO;

namespace Server.Features.User.Service
{
    public interface IUserService
    {
        Task<UserModel?> Login(GoogleJsonWebSignature.Payload loginUser);
        Task<UserModel?> GetUserById(Guid userId);
        Task<UserModel?> UpdateUser(Guid userId,UpdateUserProfileDTO updateUserProfileDTO);
    }
}
