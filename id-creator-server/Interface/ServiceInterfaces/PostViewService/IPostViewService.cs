using Server.Models;

namespace Server.PostViewService
{
    public interface IPostViewService
    {
        int GetViewCount(Guid postId);
        Task<int> LogView(PostView view);
    }
}