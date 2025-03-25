

using AutoMapper;
using RepositoryLayer.Models;
using ServiceLayer.DTOs.Response.Session;

namespace Server.Profiles
{
    public class UserSessionProfile: Profile
    {
        public UserSessionProfile()
        {
            CreateMap<User,UserSessionProfileDTO>()
                .ForMember(u=>u.UserIcon,opt=>opt.MapFrom(u=>u.UserIcon.Url));
        }
    }
}