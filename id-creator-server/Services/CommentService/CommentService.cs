



using Server.Interface.Repositories;
using Server.Interface.ServiceInterface.CommentService;
using Server.Models;
using Server.Obj;
using Server.Util.Obj;

namespace Server.Services.CommentService
{
    public class CommentService(ICommentRepository commentRepository) : ICommentService
    {
        private readonly ICommentRepository _commentRepository = commentRepository;
        public async Task<Comment?> CreateComment(Comment comment)
        {
            var addedComment = await _commentRepository.AddAsync(comment);
            await _commentRepository.SaveChangeAsync();
            return addedComment;
        }

        public async Task<Comment?> GetCommentById(Guid commentId)
        {
            return await _commentRepository.GetByIdAsync(commentId);
        }
        public async Task<List<Comment>> FindComments(SearchCommentOption option)
        {
            return (await _commentRepository.FindAsync(new RepositoryGetParams<Comment>()
            {
                Filter = c => c.PostId == option.PostId,
                OrderBy = q=>q.OrderBy(c=>c.Created),
                Skip = option.Page*option.Limit,
                Take = option.Limit
            })).ToListAsync();
        }

        public int GetCommentCount(Guid postId)
        {
            return _commentRepository.GetCommentCount(postId);
        }
    }
}