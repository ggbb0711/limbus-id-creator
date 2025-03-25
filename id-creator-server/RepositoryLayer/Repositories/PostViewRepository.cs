using RepositoryLayer.Models;
using RepositoryLayer.Repositories.Interface;

namespace RepositoryLayer.Repositories
{
    public class PostViewRepository(ServerDbContext ctx):IPostViewRepository
    {
        private readonly ServerDbContext _ctx = ctx;

        public int GetViewCount(Guid postId)
        {
            return _ctx.PostView.Count(p => p.PostId == postId);
        }

        public async Task<int> LogView(PostView view)
        {
            await _ctx.PostView.AddAsync(view);
            await _ctx.SaveChangesAsync();
            return GetViewCount(view.PostId);
        }
    }
}