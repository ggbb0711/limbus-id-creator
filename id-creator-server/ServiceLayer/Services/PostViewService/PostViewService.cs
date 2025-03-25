using RepositoryLayer.Models;
using RepositoryLayer.Repositories.Interface;
using ServiceLayer.Interfaces.PostViewService;

namespace ServiceLayer.Services.PostViewService
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