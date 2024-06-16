

using AutoMapper;
using Server.DTOs.Response.Users;
using Server.Models;

namespace Server.Profiles
{
    public class UserSessionProfile: Profile
    {
        public UserSessionProfile()
        {
            CreateMap<User,UserSessionProfileDTO>();
        }
    }
}