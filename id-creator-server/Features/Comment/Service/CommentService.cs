




using Server.Features.Comment.Repository;
using Server.Shared.Http;

namespace Server.Features.Comment.Service
{
    public class CommentService(ICommentRepository commentRepository) : ICommentService
    {
        private readonly ICommentRepository _commentRepository = commentRepository;
        public async Task<CommentModel?> CreateComment(CommentModel comment)
        {
            var addedComment = await _commentRepository.AddAsync(comment);
            await _commentRepository.SaveChangeAsync();
            return addedComment;
        }

        public async Task<CommentModel?> GetCommentById(Guid commentId)
        {
            return await _commentRepository.GetByIdAsync(commentId);
        }
        public async Task<List<CommentModel>> FindComments(SearchCommentOption option)
        {
            return [.. await _commentRepository.FindAsync(new RepositoryGetParams<CommentModel>()
            {
                Filter = c => c.PostId == option.PostId,
                OrderBy = q=>q.OrderBy(c=>c.Created),
                Skip = option.Page*option.Limit,
                Take = option.Limit
            })];
        }

        public int GetCommentCount(Guid postId)
        {
            return _commentRepository.GetCommentCount(postId);
        }
    }
}
