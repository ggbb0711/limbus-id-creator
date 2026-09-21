

using Microsoft.EntityFrameworkCore;
using Server.Shared.Database;
using Server.Shared.Repository;

namespace Server.Features.Post.Repository
{
    public class PostRepository(ServerDbContext ctx): Repository<PostModel>(ctx), IPostRepository
    {
        public int GetPostCount(SearchPostOption option)
        {
            IQueryable<PostModel> query;
            query = _ctx.Post.Where(p=>p.Title.Contains(option.Title)
            &&(option.UserId == Guid.Empty||option.UserId==p.UserId)
            &&(option.Tag.Count<1||option.Tag.All(t=>p.Tags.Select(t=>t.TagName).Contains(t)))
            && !p.IsRemoved && p.IsActive);

            return query.Count();
        }
    }
}
