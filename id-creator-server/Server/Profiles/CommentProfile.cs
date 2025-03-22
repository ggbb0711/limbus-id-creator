using AutoMapper;
using RepositoryLayer.Models;
using ServiceLayer.DTOs.Request.Comment;
using ServiceLayer.DTOs.Response.Comment;

namespace Server.Profiles
{
    public class CommentProfile: Profile
    {
        public CommentProfile()
        {
            CreateMap<CommentRequestDTO,Comment>()
                .ForMember(c=>c.UserId, opt => opt.MapFrom(c=>c.userId))
                .ForMember(c=>c.Content, opt => opt.MapFrom(c=>c.comment));
            
            CreateMap<Comment,CommentResponseDTO>()
                .ForMember(c=>c.userIcon, opt=>opt.MapFrom(c=>c.User.UserIcon.Url))
                .ForMember(c=>c.userName, opt=>opt.MapFrom(c=>c.User.UserName))
                .ForMember(c=>c.userId, opt=>opt.MapFrom(c=>c.UserId))
                .ForMember(c=>c.comment, opt=>opt.MapFrom(c=>c.Content))
                .ForMember(c=>c.date, opt=>opt.MapFrom(c=>c.Created));
        }
    }
}