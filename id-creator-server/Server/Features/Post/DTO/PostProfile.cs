

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

            CreateMap<PostModel, PostListItemDTO>()
                .ForMember(dest => dest.ImagesAttach, opt => opt.MapFrom(p => VisibleImageUrls(p)))
                .ForMember(dest => dest.UserIcon, opt => opt.MapFrom(p => p.User.UserIcon.Url))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(p => p.User.UserName))
                .ForMember(dest => dest.Tags, opt => opt.MapFrom(p => p.Tags.Select(t => t.TagName.Replace(" ", "_"))))
                .ForMember(dest => dest.HasCards, opt => opt.MapFrom((p, _, _, context) => IsInPostIdsWithCards(p, context)));

            CreateMap<PostModel, PostResponseDTO>()
                .IncludeBase<PostModel, PostListItemDTO>()
                .ForMember(dest => dest.HasCards, opt => opt.MapFrom(p => p.Cards.Count > 0))
                .ForMember(dest => dest.Slides, opt => opt.MapFrom((p, _, _, context) => MergeCardInfoAndImageUrl(VisibleImageUrls(p), p.Cards, context)));

            CreateMap<PostModel,LinkedPostDTO>();

            CreateMap<PostCard,PostCardResponseDTO>()
                .ForMember(dest=>dest.SaveInfo, opt=>opt.MapFrom(c=>JsonSerializer.Deserialize<JsonElement>(c.SaveInfo, (JsonSerializerOptions?)null)));
        }

        public const string PostIdsWithCards = nameof(PostIdsWithCards);

        private static List<string> VisibleImageUrls(PostModel post) =>
            [.. post.ImageAttaches.Where(i => i.Status != AssetStatus.Deleted).Select(i => i.Url)];

        private static bool IsInPostIdsWithCards(PostModel post, ResolutionContext context) =>
            context.TryGetItems(out var items)
            && items.TryGetValue(PostIdsWithCards, out var ids)
            && ids is IReadOnlyCollection<Guid> postIds
            && postIds.Contains(post.Id);

        private static List<PostSlideDTO> MergeCardInfoAndImageUrl(IEnumerable<string> imageUrls, IEnumerable<PostCard> cards, ResolutionContext context)
        {
            var remaining = cards.OrderBy(c => c.Position).ToList();
            return [.. imageUrls.Select(url =>
            {
                var card = remaining.FirstOrDefault(c => c.ImageUrl == url);
                if (card != null) remaining.Remove(card);
                return new PostSlideDTO
                {
                    ImageUrl = url,
                    Card = card == null ? null : context.Mapper.Map<PostCardResponseDTO>(card),
                };
            })];
        }
    }
}
