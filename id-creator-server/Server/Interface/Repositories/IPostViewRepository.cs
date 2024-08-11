using Server.Models;

namespace Server.Interface.Repositories
{
    public interface IPostViewRepository
    {
        Task<int> LogView(PostView view);
        int GetViewCount(Guid postId);
    }
}