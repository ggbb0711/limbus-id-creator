using AutoMapper;

namespace Server.Features.Comment.DTO
{
    public class CommentProfile: Profile
    {
        public CommentProfile()
        {
            CreateMap<CommentRequestDTO,CommentModel>();

            CreateMap<CommentModel,CommentResponseDTO>()
                .ForMember(c=>c.UserIcon, opt=>opt.MapFrom(c=>c.User.UserIcon.Url))
                .ForMember(c=>c.UserName, opt=>opt.MapFrom(c=>c.User.UserName));
        }
    }
}