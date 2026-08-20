

using AutoMapper;
using Server.DTOs.Response.Users;
using Server.Models;

namespace Server.Profiles
{
    public class UserProfile: Profile
    {
        public UserProfile()
        {
            CreateMap<User,UserProfileResponseDTO>()
                .ForMember(dest=>dest.UserIcon, opt=>opt.MapFrom(src=>src.UserIcon.Url));
        }
    }
}