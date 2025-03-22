using Microsoft.AspNetCore.Http;
using RepositoryLayer.Models;
using RepositoryLayer.Utils.Obj;

namespace ServiceLayer.Interfaces.UserService
{
    public interface IUserService
    {
        Task<User> Login(UserOAuthReponse loginUser);
        Task<User?> GetUser(Guid userId);
        Task<string?> ChangeUserName(Guid userId,string newName);
        Task<string?> ChangeUserProfile(Guid userId, IFormFile newProfile);
    }
}