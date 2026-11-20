using Microsoft.EntityFrameworkCore;
using Server.Features.SaveInfo.Repository;
using Server.Shared.Database;
using Server.Shared.Exception;
using Server.Shared.Model;

namespace Server.Features.Post.Service
{
    public record PostCardBackfillReport(int PostsScanned, int FullyMatched, int PartlyMatched, int Unmatched, int CardsCreated, int PendingSkipped);

    public class PostCardBackfill(
        ServerDbContext ctx,
        ISaveInfoRepository<SavedIDInfo, SavedId> idSaves,
        ISaveInfoRepository<SavedEGOInfo, SavedEgo> egoSaves,
        IPostCardBuilder builder)
    {
        public async Task<PostCardBackfillReport> RunAsync(bool dryRun)
        {
            var posts = await ctx.Post
                .Where(p => !ctx.PostCard.Any(c => c.PostId == p.Id))
                .Select(p => new { p.Id, p.UserId, Urls = p.ImageAttaches.Select(i => i.Url).ToList() })
                .ToListAsync();

            int full = 0, partly = 0, none = 0, created = 0, pending = 0;
            foreach (var post in posts)
            {
                var ids = await idSaves.FindByImageUrlsIncludingSaved(post.UserId, post.Urls);
                var egos = await egoSaves.FindByImageUrlsIncludingSaved(post.UserId, post.Urls);
                var cards = new List<PostCard>();

                for (var position = 0; position < post.Urls.Count; position++)
                {
                    var url = post.Urls[position];
                    try
                    {
                        var id = ids.FirstOrDefault(s => s.ImageAttach.Url == url);
                        var ego = id == null ? egos.FirstOrDefault(s => s.ImageAttach.Url == url) : null;
                        var card = id != null ? builder.FromIdentity(id, position)
                            : ego != null ? builder.FromEgo(ego, position)
                            : null;
                        if (card == null) continue;
                        card.PostId = post.Id;
                        cards.Add(card);
                    }
                    catch (ConflictException)
                    {
                        pending++;
                    }
                }

                if (cards.Count == 0) none++;
                else if (cards.Count == post.Urls.Count) full++;
                else partly++;

                if (dryRun || cards.Count == 0) continue;
                ctx.PostCard.AddRange(cards);
                await ctx.SaveChangesAsync();
                created += cards.Count;
            }

            return new PostCardBackfillReport(posts.Count, full, partly, none, created, pending);
        }
    }
}
