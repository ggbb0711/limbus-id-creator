using RepositoryLayer.Models;
using RepositoryLayer.Utils.Obj;

namespace ServiceLayer.Interfaces.IPostService
{
    public interface IPostService
    {
        public Task<Post?> FindPostById(Guid postId);
        public Task<List<Post>> FindPosts(SearchPostOption option);
        public Task<Post?> CreatePost (Post newPost);
        public int GetPostCount(SearchPostOption option);
    }
}