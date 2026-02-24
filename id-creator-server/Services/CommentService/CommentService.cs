



using Server.Interface.Repositories;
using Server.Interface.ServiceInterface.CommentService;
using Server.Models;
using Server.Obj;

namespace Server.Services.CommentService
{
    public class CommentService(ICommentRepository commentRepository) : ICommentService
    {
        private readonly ICommentRepository _commentRepository = commentRepository;
        public async Task<Comment?> CreateComment(Comment comment)
        {
            return await _commentRepository.CreateComment(comment);
        }

        public async Task<Comment?> FindCommentById(Guid commentId)
        {
            return await _commentRepository.GetCommentById(commentId);
        }

        public async Task<List<Comment>> FindComments(SearchCommentOption option)
        {
            return await _commentRepository.GetComments(option);
        }

        public int GetCommentCount(Guid postId)
        {
            return _commentRepository.GetCommentCount(postId);
        }
    }
}