

using System.Text.Json;
using AutoMapper;
using Server.Features.Images.Enum;
using Server.Shared.Model;

namespace Server.Features.Post.DTO
{
    public class PostProfile:Profile
    {
        public PostProfile()
        {
            CreateMap<PostRequestDTO,PostModel>()
                .ForMember(dest=>dest.ImageAttaches, opt=>opt.Ignore())
                .ForMember(dest=>dest.Cards, opt=>opt.Ignore())
                .ForMember(dest=>dest.Tags, opt=> opt.MapFrom(p=>p.Tags.Select(t=>
                    new Tag()
                    {
                        TagName = t,
                    })));

            CreateMap<PostModel,PostResponseDTO>()
                .ForMember(dest=>dest.ImagesAttach, opt=>opt.MapFrom(p=>p.ImageAttaches.Where(i=>i.Status != AssetStatus.Deleted).Select(i=>i.Url)))
                .ForMember(dest=>dest.UserIcon, opt=>opt.MapFrom(p=>p.User.UserIcon.Url))
                .ForMember(dest=>dest.UserName, opt=>opt.MapFrom(p=>p.User.UserName))
                .ForMember(dest=>dest.Tags, opt=> opt.MapFrom(p=>p.Tags.Select(t=>t.TagName.Replace(" ","_"))))
                .ForMember(dest=>dest.Cards, opt=>opt.Ignore())
                .ForMember(dest=>dest.HasCards, opt=>opt.Ignore());

            CreateMap<PostModel,LinkedPostDTO>();

            CreateMap<PostCard,PostCardResponseDTO>()
                .ForMember(dest=>dest.SaveInfo, opt=>opt.MapFrom(c=>JsonSerializer.Deserialize<JsonElement>(c.SaveInfo, (JsonSerializerOptions?)null)));
        }
    }
}