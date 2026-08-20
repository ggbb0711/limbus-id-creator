using Server.Interface.Repositories;
using Server.Models;

namespace Server.PostViewService
{
    public class PostViewService(IPostViewRepository postViewRepository) : IPostViewService
    {
        public int GetViewCount(Guid postId)
        {
            return postViewRepository.GetViewCount(postId);
        }

        public async Task<int> LogView(PostView view)
        {
            await postViewRepository.AddAsync(view);
            await postViewRepository.SaveChangeAsync();
            return postViewRepository.GetViewCount(view.PostId);
        }
    }
}