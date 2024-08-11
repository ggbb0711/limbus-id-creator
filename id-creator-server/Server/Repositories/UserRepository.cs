using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Server.Data;
using Server.DTOs.Response.Users;
using Server.Interface.Repositories;
using Server.Models;

namespace Server.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ServerDbContext _ctx;
        public UserRepository(ServerDbContext ctx)
        {
            _ctx = ctx;
        }

        public async Task<User?> ChangeUser(Guid id, UserChangeProfileDTO userChangeProfile)
        {
            var foundUser = await _ctx.Users.FirstOrDefaultAsync(user => user.Id == id);
            if(foundUser != null)
            {
                if(!userChangeProfile.UserName.IsNullOrEmpty())foundUser.UserName = userChangeProfile.UserName;
                if(!userChangeProfile.UserIcon.IsNullOrEmpty())
                {
                    foundUser.UserIcon.Url = userChangeProfile.UserIcon;
                    foundUser.UserIcon.LastUpdated = DateTime.Now;
                }

                await _ctx.SaveChangesAsync();
            }
            return foundUser;
        }

        public async Task<User?> CreateUser(User newUser)
        {
            _ctx.Users.Add(newUser);
            await _ctx.SaveChangesAsync();
            return newUser;
        }

        public async Task<User?> GetUserByEmail(string email)
        {
            return await _ctx.Users.FirstOrDefaultAsync(user=> user.UserEmail == email);
        }

        public async Task<User?> GetUserById(Guid id)
        {
            return await _ctx.Users.FirstOrDefaultAsync(user=> user.Id == id);    
        }
    }
}