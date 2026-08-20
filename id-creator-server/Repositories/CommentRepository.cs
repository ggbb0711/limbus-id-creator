using Server.Data;
using Server.Interface.Repositories;
using Server.Models;

namespace Server.Repositories
{
    public class CommentRepository(ServerDbContext ctx): Repository<Comment>(ctx), ICommentRepository
    {

        public int GetCommentCount(Guid postId)
        {
            return ctx.Comment.Where(c=>c.PostId==postId).Count();
        }
    }
}