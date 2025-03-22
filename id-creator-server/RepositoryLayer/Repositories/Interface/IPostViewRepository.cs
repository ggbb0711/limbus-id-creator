using RepositoryLayer.Models;

namespace RepositoryLayer.Repositories.Interface
{
    public interface IPostViewRepository
    {
        Task<int> LogView(PostView view);
        int GetViewCount(Guid postId);
    }
}