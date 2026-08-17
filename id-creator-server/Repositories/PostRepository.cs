

using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Server.Data;
using Server.Interface.Repositories;
using Server.Models;
using Server.Util.Enums;
using Server.Util.Obj;

namespace Server.Repositories
{
    public class PostRepository(ServerDbContext ctx):IPostRepository
    {
        private readonly ServerDbContext _ctx = ctx;

        public async Task<Post?> CreatePost(Post newPost)
        {
            await _ctx.AddAsync(newPost);
            await _ctx.SaveChangesAsync();
            return await GetPostById(newPost.Id);
        }

        public async Task<Post?> GetPostById(Guid postId)
        {
            return await _ctx.Post.Where(p=>p.Id == postId && !p.IsRemoved && p.IsActive).FirstOrDefaultAsync();
        }

        public int GetPostCount(SearchPostOption option)
        {
            IQueryable<Post> query;
            query = _ctx.Post.Where(p=>p.Title.Contains(option.Title)
            &&(option.UserId == null||option.UserId==p.UserId)
            &&(option.Tag.Count<1||option.Tag.All(t=>p.Tags.Select(t=>t.TagName).Contains(t)))
            && !p.IsRemoved && p.IsActive);

            return query.Count();
        }

        public async Task<List<Post>> GetPosts(SearchPostOption option)
        {
            IQueryable<Post> query;
            query = _ctx.Post.Where(p=>p.Title.ToLower().Contains(option.Title.ToLower())
            &&(option.UserId == null||option.UserId == p.UserId)
            &&(option.Tag.Count<1||option.Tag.All(t=>p.Tags.Select(t=>t.TagName).Contains(t)))
            && !p.IsRemoved && p.IsActive);

            query = option.SortedBy switch
            {
                PostSortOption.Title => query.OrderBy(p => p.Title),
                PostSortOption.MostViewed => query.OrderByDescending(post=> _ctx.PostView.Where(pv => pv.PostId == post.Id).Count()),
                PostSortOption.MostCommented => query.OrderByDescending(p => _ctx.Comment.Where(c => c.PostId == p.Id).Count()),
                PostSortOption.Earliest => query.OrderBy(p => p.Created),
                _ => query.OrderByDescending(p => p.Created),
            };
            return await query
                .Skip(option.limit*option.page)
                .Take(option.limit)
                .ToListAsync();
        }
    }
}