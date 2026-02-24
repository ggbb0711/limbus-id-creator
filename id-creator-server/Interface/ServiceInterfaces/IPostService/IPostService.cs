


using Server.Models;
using Server.Util.Obj;

namespace Server.Interface.ServiceInterface.IPostService
{
    public interface IPostService
    {
        public Task<Post?> FindPostById(Guid postId);
        public Task<List<Post>> FindPosts(SearchPostOption option);
        public Task<Post?> CreatePost (Post newPost);
        public int GetPostCount(SearchPostOption option);
    }
}