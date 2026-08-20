

using Server.Models;

namespace Server.Interface.Repositories
{
    public interface ICommentRepository: IRepository<Comment>
    {
        int GetCommentCount(Guid postId);
    }
}