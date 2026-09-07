using AutoMapper;
using Server.DTOs.Requests.Comment;
using Server.Models;
using Server.Response.Comment;

namespace Server.Profiles
{
    public class CommentProfile: Profile
    {
        public CommentProfile()
        {
            CreateMap<CommentRequestDTO,Comment>();
            
            CreateMap<Comment,CommentResponseDTO>()
                .ForMember(c=>c.UserIcon, opt=>opt.MapFrom(c=>c.User.UserIcon.Url))
                .ForMember(c=>c.UserName, opt=>opt.MapFrom(c=>c.User.UserName));
        }
    }
}