using Server.Features.Post.DTO;
using Server.Shared.Model;

namespace Server.Features.Post.Service
{
    public interface IPostCardBuilder
    {
        Task<List<PostCard>> BuildAsync(Guid userId, IReadOnlyList<PostCardRequestDTO> cards);
        PostCard FromIdentity(SavedIDInfo save, int position);
        PostCard FromEgo(SavedEGOInfo save, int position);
    }
}
