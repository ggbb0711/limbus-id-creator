

using AutoMapper;
using Server.DTOs.Response.Users;
using Server.Models;

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