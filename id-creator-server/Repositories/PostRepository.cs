

using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Interface.Repositories;
using Server.Models;
using Server.Util.Obj;

namespace Server.Repositories
{
    public class PostRepository(ServerDbContext ctx): Repository<Post>(ctx), IPostRepository
    {
        public int GetPostCount(SearchPostOption option)
        {
            IQueryable<Post> query;
            query = _ctx.Post.Where(p=>p.Title.Contains(option.Title)
            &&(option.UserId == null||option.UserId==p.UserId)
            &&(option.Tag.Count<1||option.Tag.All(t=>p.Tags.Select(t=>t.TagName).Contains(t)))
            && !p.IsRemoved && p.IsActive);

            return query.Count();
        }
    }
}