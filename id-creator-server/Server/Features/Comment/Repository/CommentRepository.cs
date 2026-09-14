using Server.Shared.Database;
using Server.Shared.Repository;

namespace Server.Features.Comment.Repository
{
    public class CommentRepository(ServerDbContext ctx): Repository<CommentModel>(ctx), ICommentRepository
    {

        public int GetCommentCount(Guid postId)
        {
            return _ctx.Comment.Where(c=>c.PostId==postId).Count();
        }
    }
}
