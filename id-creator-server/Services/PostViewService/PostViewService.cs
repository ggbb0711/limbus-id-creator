using Server.Interface.Repositories;
using Server.Models;

namespace Server.PostViewService
{
    public class PostViewService(IPostViewRepository postViewRepository) : IPostViewService
    {
        private readonly IPostViewRepository _postViewRepository = postViewRepository;
        public int GetViewCount(Guid postId)
        {
            return _postViewRepository.GetViewCount(postId);
        }

        public Task<int> LogView(PostView view)
        {
            return _postViewRepository.LogView(view);
        }
    }
}