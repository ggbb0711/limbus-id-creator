

using AutoMapper;
using Server.DTOs.Requests.Post;
using Server.DTOs.Response.Post;
using Server.Models;

namespace Server.Profiles
{
    public class PostProfile:Profile
    {
        public PostProfile()
        {
            CreateMap<PostRequestDTO,Post>()
                .ForMember(dest=>dest.ImageAttaches, opt=>opt.MapFrom(p=>p.ImagesAttach.Select(i=>
                    new ImageObj()
                    {
                        Url = i,
                    })))
                .ForMember(dest=>dest.Tags, opt=> opt.MapFrom(p=>p.Tags.Select(t=>
                    new Tag()
                    {
                        TagName = t,
                    })));

            CreateMap<Post,PostResponseDTO>()
                .ForMember(dest=>dest.ImagesAttach, opt=>opt.MapFrom(p=>p.ImageAttaches.Select(i=>i.Url)))
                .ForMember(dest=>dest.UserIcon, opt=>opt.MapFrom(p=>p.User.UserIcon.Url))
                .ForMember(dest=>dest.UserName, opt=>opt.MapFrom(p=>p.User.UserName))
                .ForMember(dest=>dest.Tags, opt=> opt.MapFrom(p=>p.Tags.Select(t=>t.TagName.Replace(" ","_"))))
                .ForMember(dest=>dest.Created, opt=>opt.MapFrom(p=>p.Created));
        }
    }
}