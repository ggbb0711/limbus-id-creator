

using CloudinaryDotNet;
using Server.Models;
using Server.Util.Obj;

namespace Server.Interface.Repositories
{
    public interface IPostRepository
    {
        Task<Post?> GetPostById(Guid postId);
        Task<List<Post>> GetPosts(SearchPostOption option);
        Task<Post?> CreatePost(Post newPost);
        int GetPostCount(SearchPostOption option);
    }
}