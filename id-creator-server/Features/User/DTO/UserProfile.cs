

using AutoMapper;

namespace Server.Features.User.DTO
{
    public class UserProfile: Profile
    {
        public UserProfile()
        {
            CreateMap<UserModel,UserProfileResponseDTO>()
                .ForMember(dest=>dest.UserIcon, opt=>opt.MapFrom(src=>src.UserIcon.Url));
        }
    }
}