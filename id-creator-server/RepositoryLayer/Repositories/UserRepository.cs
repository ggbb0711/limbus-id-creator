using Microsoft.EntityFrameworkCore;
using RepositoryLayer.Models;
using RepositoryLayer.Repositories.Interface;

namespace RepositoryLayer.Repositories
{
    public class UserRepository(ServerDbContext ctx) : IUserRepository
    {
        public async Task<User?> UpdateUser(User updatedUser)
        {
            ctx.Users.Update(updatedUser);
            await ctx.SaveChangesAsync();
            return updatedUser;
        }

        public async Task<User?> CreateUser(User newUser)
        {
            ctx.Users.Add(newUser);
            await ctx.SaveChangesAsync();
            return newUser;
        }

        public async Task<User?> GetUserByEmail(string email)
        {
            return await ctx.Users.FirstOrDefaultAsync(user=> user.UserEmail == email);
        }

        public async Task<User?> GetUserById(Guid id)
        {
            return await ctx.Users.FirstOrDefaultAsync(user=> user.Id == id);    
        }

       
    }
}