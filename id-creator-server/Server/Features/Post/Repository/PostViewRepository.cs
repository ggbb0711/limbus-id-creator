using Server.Shared.Database;
using Server.Shared.Model;
using Server.Shared.Repository;

namespace Server.Features.Post.Repository
{
    public class PostViewRepository(ServerDbContext ctx): Repository<PostView>(ctx),IPostViewRepository
    {

        public int GetViewCount(Guid postId)
        {
            return _ctx.PostView.Where(p=>p.PostId == postId).Count();
        }

        // public async Task<int> LogView(PostView view)
        // {
        //     await _ctx.PostView.AddAsync(view);
        //     await _ctx.SaveChangesAsync();
        //     return GetViewCount(view.PostId);
        // }
    }
}
