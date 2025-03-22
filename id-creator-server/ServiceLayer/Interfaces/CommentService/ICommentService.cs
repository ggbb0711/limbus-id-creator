using RepositoryLayer.Models;
using RepositoryLayer.Utils.Obj;

namespace ServiceLayer.Interfaces.CommentService
{
    public interface ICommentService
    {
        Task<Comment?> CreateComment(Comment comment);
        Task<List<Comment>> FindComments(SearchCommentOption option);
        Task<Comment?> FindCommentById(Guid commentId);
        int GetCommentCount(Guid postId);
    }
}