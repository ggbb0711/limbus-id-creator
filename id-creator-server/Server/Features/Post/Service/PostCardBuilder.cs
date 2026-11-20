using System.Text.Json;
using AutoMapper;
using Server.Features.Images;
using Server.Features.Images.Enum;
using Server.Features.Post.DTO;
using Server.Features.SaveInfo.DTO;
using Server.Features.SaveInfo.Service;
using Server.Shared.Exception;
using Server.Shared.Model;
using Server.Shared.Model.Interface;

namespace Server.Features.Post.Service
{
    public class PostCardBuilder(
        ISavedInfoService<SavedIDInfo, SavedId> idSaves,
        ISavedInfoService<SavedEGOInfo, SavedEgo> egoSaves,
        IMapper mapper) : IPostCardBuilder
    {
        public async Task<List<PostCard>> BuildAsync(Guid userId, IReadOnlyList<PostCardRequestDTO> cards)
        {
            var built = new List<PostCard>();
            for (var position = 0; position < cards.Count; position++)
            {
                var request = cards[position];
                built.Add(request.Kind switch
                {
                    PostCardKind.Identity => FromIdentity(await LoadOwned(idSaves, request.SaveId, userId), position),
                    _ => FromEgo(await LoadOwned(egoSaves, request.SaveId, userId), position),
                });
            }
            return built;
        }

        public PostCard FromIdentity(SavedIDInfo save, int position) =>
            Build(save, PostCardKind.Identity, mapper.Map<SaveInfoResponseDTO<SavedIDRequestDTO>>(save), position);

        public PostCard FromEgo(SavedEGOInfo save, int position) =>
            Build(save, PostCardKind.Ego, mapper.Map<SaveInfoResponseDTO<SavedEgoRequestDTO>>(save), position);

        public static bool HasPendingImages<TPayload>(ISavedEntry<TPayload> save) where TPayload : ISavedPayload
        {
            var skill = save.Saved.Skill;
            IEnumerable<ImageObj?> images =
            [
                save.ImageAttach,
                save.Saved.SplashArt,
                save.Saved.SinnerIcon,
                .. skill.OffenseSkills.Select(s => s.ImageAttach),
                .. skill.DefenseSkills.Select(s => s.ImageAttach),
                .. skill.CustomEffects.Select(s => s.ImageAttach),
            ];
            return images.Any(image => image != null
                && (image.Status == AssetStatus.Pending || FileHelper.IsBase64String(image.Url.Replace("data:image/png;base64,", ""))));
        }

        private static async Task<TEntry> LoadOwned<TEntry, TPayload>(ISavedInfoService<TEntry, TPayload> saves, Guid saveId, Guid userId)
            where TEntry : ISavedEntry<TPayload>
            where TPayload : ISavedPayload
        {
            var save = await saves.FindSavedInfoById(saveId, true)
                ?? throw new NotFoundException(ApiErrors.SaveNotFound);
            if (save.UserId != userId) throw new ForbiddenException(ApiErrors.ResourceNotOwned);
            return save;
        }

        private static PostCard Build<TPayload, TDto>(ISavedEntry<TPayload> save, PostCardKind kind, SaveInfoResponseDTO<TDto> mapped, int position)
            where TPayload : ISavedPayload
        {
            if (HasPendingImages(save)) throw new ConflictException(ApiErrors.SaveImagesPending);
            return new PostCard
            {
                Kind = kind,
                SaveId = save.Id,
                ImageUrl = mapped.PreviewImg,
                Position = position,
                SaveInfo = JsonSerializer.Serialize(mapped.SaveInfo, PostCardJson.Options),
            };
        }
    }
}
