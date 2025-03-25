

using AutoMapper;
using RepositoryLayer.Models;
using ServiceLayer.DTOs.Response.Users;

namespace Server.Profiles
{
    public class UserProfile: Profile
    {
        public UserProfile()
        {
            CreateMap<User,UserProfileDTO>()
                .ForMember(dest=>dest.UserIcon, opt=>opt.MapFrom(src=>src.UserIcon.Url));
            CreateMap<User,UserChangeProfileDTO>();
        }
    }
}