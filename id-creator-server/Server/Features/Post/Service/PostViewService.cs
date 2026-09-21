using Server.Features.Post.Repository;
using Server.Shared.Model;

namespace Server.Features.Post.Service
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
