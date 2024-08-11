using Server.Data;
using Server.Interface.Repositories;
using Server.Models;

namespace Server.Repositories
{
    public class PostViewRepository(ServerDbContext ctx):IPostViewRepository
    {
        private readonly ServerDbContext _ctx = ctx;

        public int GetViewCount(Guid postId)
        {
            return _ctx.PostView.Where(p=>p.PostId == postId).Count();
        }

        public async Task<int> LogView(PostView view)
        {
            await _ctx.PostView.AddAsync(view);
            await _ctx.SaveChangesAsync();
            return GetViewCount(view.PostId);
        }
    }
}