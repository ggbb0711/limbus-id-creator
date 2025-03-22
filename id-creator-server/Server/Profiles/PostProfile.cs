

using AutoMapper;
using RepositoryLayer.Models;
using ServiceLayer.DTOs.Request.Post;
using ServiceLayer.DTOs.Response.Post;

namespace Server.Profiles
{
    public class PostProfile:Profile
    {
        public PostProfile()
        {
            CreateMap<PostRequestDTO,Post>()
                .ForMember(dest=>dest.Id, opt=>opt.MapFrom(p=>p.id))
                .ForMember(dest=>dest.Title, opt=>opt.MapFrom(p=>p.title))
                .ForMember(dest=>dest.Description, opt=>opt.MapFrom(p=>p.description))
                .ForMember(dest => dest.UserId, opt=> opt.MapFrom(p=>p.userId))
                .ForMember(dest=>dest.ImageAttaches, opt=>opt.MapFrom(p=>p.imagesAttach.Select(i=>
                    new ImageObj()
                    {
                        Id = Guid.NewGuid(),
                        Url = i,
                    })))
                .ForMember(dest=>dest.Tags, opt=> opt.MapFrom(p=>p.tags.Select(t=>
                    new Tag()
                    {
                        TagName = t,
                        PostId = p.id,
                    })));

            CreateMap<Post,PostResponseDTO>()
                .ForMember(dest=>dest.id, opt=>opt.MapFrom(p=>p.Id))
                .ForMember(dest=>dest.title, opt=>opt.MapFrom(p=>p.Title))
                .ForMember(dest=>dest.description, opt=>opt.MapFrom(p=>p.Description))
                .ForMember(dest=>dest.imagesAttach, opt=>opt.MapFrom(p=>p.ImageAttaches.Select(i=>i.Url)))
                .ForMember(dest=>dest.userIcon, opt=>opt.MapFrom(p=>p.User.UserIcon.Url))
                .ForMember(dest=>dest.userName, opt=>opt.MapFrom(p=>p.User.UserName))
                .ForMember(dest=>dest.userId,opt => opt.MapFrom(p=>p.UserId))
                .ForMember(dest=>dest.tags, opt=> opt.MapFrom(p=>p.Tags.Select(t=>t.TagName.Replace(" ","_"))))
                .ForMember(dest=>dest.created, opt=>opt.MapFrom(p=>p.Created));
        }
    }
}