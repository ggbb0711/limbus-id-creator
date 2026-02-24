

using Server.Models;
using Server.Obj;

namespace Server.Interface.Repositories
{
    public interface ICommentRepository
    {
        Task<Comment?> CreateComment(Comment comment);
        Task<List<Comment>> GetComments(SearchCommentOption option);
        Task<Comment?> GetCommentById(Guid commentId);
        int GetCommentCount(Guid postId);
    }
}