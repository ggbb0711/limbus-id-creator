using RepositoryLayer.Models;
using RepositoryLayer.Utils.Obj;

namespace RepositoryLayer.Repositories.Interface
{
    public interface IPostRepository
    {
        Task<Post?> GetPostById(Guid postId);
        Task<List<Post>> GetPosts(SearchPostOption option);
        Task<Post?> CreatePost(Post newPost);
        int GetPostCount(SearchPostOption option);
    }
}