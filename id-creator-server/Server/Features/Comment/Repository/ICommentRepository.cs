

using Server.Shared.Repository;

namespace Server.Features.Comment.Repository
{
    public interface ICommentRepository: IRepository<CommentModel>
    {
        int GetCommentCount(Guid postId);
    }
}
