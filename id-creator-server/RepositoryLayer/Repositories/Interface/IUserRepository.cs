using RepositoryLayer.Models;

namespace RepositoryLayer.Repositories.Interface
{
    public interface IUserRepository
    {
        Task<User?> CreateUser(User newUser);
        Task<User?> GetUserByEmail(string email);
        Task<User?> GetUserById(Guid id);
        Task<User?> UpdateUser(User updatedUser);
    }
}