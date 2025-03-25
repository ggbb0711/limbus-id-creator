using RepositoryLayer.Models;

namespace ServiceLayer.Interfaces.PostViewService
{
    public interface IPostViewService
    {
        int GetViewCount(Guid postId);
        Task<int> LogView(PostView view);
    }
}