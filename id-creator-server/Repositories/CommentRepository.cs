using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Interface.Repositories;
using Server.Models;
using Server.Obj;

namespace Server.Repositories
{
    public class CommentRepository(ServerDbContext ctx):ICommentRepository
    {
        private readonly ServerDbContext _ctx = ctx;

        public async Task<Comment?> CreateComment(Comment comment)
        {
            await _ctx.AddAsync(comment);
            await _ctx.SaveChangesAsync();
            return await GetCommentById(comment.Id);
        }

        public async Task<Comment?> GetCommentById(Guid commentId)
        {
            return await _ctx.Comment.FindAsync(commentId);
        }

        public async Task<List<Comment>> GetComments(SearchCommentOption option)
        {
            return await _ctx.Comment
                .Where(c=>c.PostId.ToString().Equals(option.PostId))
                .OrderBy(c=>c.Created)
                .Skip(option.page*option.limit)
                .Take(option.limit)
                .ToListAsync();
        }

        public int GetCommentCount(Guid postId)
        {
            return _ctx.Comment.Where(c=>c.PostId==postId).Count();
        }
    }
}