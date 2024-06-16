

using Server.DTOs.Response.Users;
using Server.Models;

namespace Server.Interface.Repositories
{
    public interface IUserRepository
    {
        Task<User?> CreateUser(User newUser);
        Task<User?> GetUserByEmail(string email);
        Task<User?> GetUserById(Guid id);
        Task<User?> ChangeUser(Guid id,UserChangeProfileDTO userChangeProfile);
    }
}