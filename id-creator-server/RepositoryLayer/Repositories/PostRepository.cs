using Microsoft.EntityFrameworkCore;
using RepositoryLayer.Models;
using RepositoryLayer.Repositories.Interface;
using RepositoryLayer.Utils.Obj;

namespace RepositoryLayer.Repositories
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
            return await _ctx.Post.Where(p=>p.Id == postId).FirstOrDefaultAsync();
        }

        public int GetPostCount(SearchPostOption option)
        {
            IQueryable<Post> query;
            query = _ctx.Post.Where(p=>p.Title.Contains(option.Title)
            &&(option.UserId==p.UserId.ToString())
            &&(option.Tag.Count<1||option.Tag.All(t=>p.Tags.Select(t=>t.TagName).Contains(t))));

            switch(option.SortedBy)
            {
                case "Title":
                    query=query.OrderBy(p=>p.Title);
                    break;
                case "Most_Viewed":
                    query = query.OrderBy(p=> _ctx.PostView.Where(p=>p.PostId == p.Id).Count());
                    break;
                case "Most_Commented":
                    query = query.OrderBy(p=>_ctx.Comment.Where(c=>c.PostId==p.Id).Count());
                    break;
                case "Earliest":
                    query = query.OrderBy(p=>p.Created);
                    break;
                default:
                    query = query.OrderByDescending(p=>p.Created);
                    break;
            }

            return query.Count();
        }

        public async Task<List<Post>> GetPosts(SearchPostOption option)
        {
            IQueryable<Post> query;
            query = _ctx.Post.Where(p=>p.Title.ToLower().Contains(option.Title.ToLower())
            &&(option.UserId==p.UserId.ToString())
            &&(option.Tag.Count<1||option.Tag.All(t=>p.Tags.Select(t=>t.TagName).Contains(t))));

            switch(option.SortedBy)
            {
                case "Title":
                    query=query.OrderBy(p=>p.Title);
                    break;
                case "Most_Viewed":
                    query = query.OrderByDescending(p=> _ctx.PostView.Where(p=>p.PostId == p.Id).Count());
                    break;
                case "Most_Commented":
                    query = query.OrderByDescending(p=>_ctx.Comment.Where(c=>c.PostId==p.Id).Count());
                    break;
                case "Earliest":
                    query = query.OrderBy(p=>p.Created);
                    break;
                default:
                    query = query.OrderByDescending(p=>p.Created);
                    break;
            }

            return await query
                .Skip(option.limit*option.page)
                .Take(option.limit)
                .ToListAsync();
        }
    }
}