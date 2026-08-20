

using Server.Models;
using Server.Obj;

namespace Server.Interface.ServiceInterface.CommentService
{
    public interface ICommentService
    {
        Task<Comment?> CreateComment(Comment comment);
        Task<List<Comment>> FindComments(SearchCommentOption option);
        Task<Comment?> GetCommentById(Guid commentId);
        int GetCommentCount(Guid postId);
    }
}