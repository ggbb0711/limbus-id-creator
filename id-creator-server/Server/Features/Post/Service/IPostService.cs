



using Server.Features.Post.Repository;

namespace Server.Features.Post.Service
{
    public interface IPostService
    {
        public Task<PostModel?> GetPostById(Guid postId);
        public Task<List<PostModel>> FindPosts(SearchPostOption option);
        public Task<PostModel> CreatePost (PostModel newPost);
        public int GetPostCount(SearchPostOption option);
    }
}
