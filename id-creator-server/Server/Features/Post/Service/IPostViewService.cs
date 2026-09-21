using Server.Shared.Model;

namespace Server.Features.Post.Service
{
    public interface IPostViewService
    {
        int GetViewCount(Guid postId);
        Task<int> LogView(PostView view);
    }
}
