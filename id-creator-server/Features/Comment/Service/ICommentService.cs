

using Server.Features.Comment.Repository;

namespace Server.Features.Comment.Service
{
    public interface ICommentService
    {
        Task<CommentModel?> CreateComment(CommentModel comment);
        Task<List<CommentModel>> FindComments(SearchCommentOption option);
        Task<CommentModel?> GetCommentById(Guid commentId);
        int GetCommentCount(Guid postId);
    }
}
