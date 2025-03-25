using Microsoft.EntityFrameworkCore;
using RepositoryLayer.Models;
using RepositoryLayer.Repositories.Interface;
using RepositoryLayer.Utils.Obj;

namespace RepositoryLayer.Repositories
{
    public class CommentRepository(ServerDbContext ctx): ICommentRepository
    {
        public async Task<Comment?> CreateComment(Comment comment)
        {
            await ctx.AddAsync(comment);
            await ctx.SaveChangesAsync();
            return await GetCommentById(comment.Id);
        }

        public async Task<Comment?> GetCommentById(Guid commentId)
        {
            return await ctx.Comment.FindAsync(commentId);
        }

        public async Task<List<Comment>> GetComments(SearchCommentOption option)
        {
            return await ctx.Comment
                .Where(c=>c.PostId.ToString().Equals(option.PostId))
                .OrderBy(c=>c.Created)
                .Skip(option.page*option.limit)
                .Take(option.limit)
                .ToListAsync();
        }

        public int GetCommentCount(Guid postId)
        {
            return ctx.Comment.Count(c => c.PostId==postId);
        }
    }
}