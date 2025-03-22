using RepositoryLayer.Models;
using RepositoryLayer.Utils.Obj;

namespace RepositoryLayer.Repositories.Interface
{
    public interface ICommentRepository
    {
        Task<Comment?> CreateComment(Comment comment);
        Task<List<Comment>> GetComments(SearchCommentOption option);
        Task<Comment?> GetCommentById(Guid commentId);
        int GetCommentCount(Guid postId);
    }
}