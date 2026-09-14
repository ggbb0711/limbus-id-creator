

using AutoMapper;

namespace Server.Features.Auth.DTO
{
    public class UserSessionProfile: Profile
    {
        public UserSessionProfile()
        {
            CreateMap<UserModel,UserSessionProfileDTO>()
                .ForMember(u=>u.UserIcon,opt=>opt.MapFrom(u=>u.UserIcon.Url));
        }
    }
}