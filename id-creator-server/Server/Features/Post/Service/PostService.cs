using Microsoft.IdentityModel.Tokens;
using Server.Features.Comment.Repository;
using Server.Features.Post.Enum;
using Server.Features.Post.Repository;
using Server.Features.Images.Enum;
using Server.Shared.Http;
using Server.Shared.Model;

namespace Server.Features.Post.Service
{
    public class PostService(IPostRepository postRepository, ICommentRepository commentRepository) : IPostService
    {
        public async Task<PostModel> CreatePost(PostModel newPost)
        {
            var res = await postRepository.AddAsync(newPost);
            await postRepository.SaveChangeAsync();
            return res;
        }

        public async Task<PostModel?> GetPostById(Guid postId)
        {
            return await postRepository.GetByIdAsync(postId);
        }

        public async Task<List<PostModel>> FindPosts(SearchPostOption option)
        {
            return [.. await postRepository.FindAsync(new RepositoryGetParams<PostModel>()
            {
                Filter = p=>(p.Title.Contains(option.Title) || option.Title.IsNullOrEmpty())
                    &&(option.UserId == Guid.Empty||option.UserId == p.UserId)
                    &&(option.Tag.Count<1||option.Tag.All(t=>p.Tags.Select(t=>t.TagName).Contains(t)))
                    &&(option.ExcludeIds.Count<1||!option.ExcludeIds.Contains(p.Id))
                    &&(option.SaveIds.Count<1||p.Cards.Any(c=>c.SaveId != null && option.SaveIds.Contains(c.SaveId.Value)))
                    && !p.IsRemoved && p.IsActive,
                IncludeProperties = option.IncludeCards ? "Cards" : "",
                OrderBy = query => option.SortedBy switch
                    {
                        PostSortOption.Title => query.OrderBy(p => p.Title),
                        PostSortOption.MostViewed => query.OrderByDescending(post=> postRepository.GetPostCount(option)),
                        PostSortOption.MostCommented => query.OrderByDescending(p => commentRepository.GetCommentCount(p.Id)),
                        PostSortOption.Earliest => query.OrderBy(p => p.Created),
                        _ => query.OrderByDescending(p => p.Created),
                    },
                Skip = option.limit * option.page,
                Take = option.limit
            })];
        }

        public int GetPostCount(SearchPostOption option)
        {
            return postRepository.GetPostCount(option);
        }

        public async Task<Dictionary<Guid, List<PostModel>>> FindPostsBySave(IReadOnlyCollection<Guid> saveIds)
        {
            if (saveIds.Count == 0) return [];
            var posts = await FindPosts(new SearchPostOption { SaveIds = [.. saveIds], IncludeCards = true, limit = int.MaxValue });
            return posts
                .SelectMany(post => post.Cards
                    .Where(c => c.SaveId != null && saveIds.Contains(c.SaveId.Value))
                    .Select(c => (SaveId: c.SaveId!.Value, Post: post)))
                .DistinctBy(x => (x.SaveId, x.Post.Id))
                .GroupBy(x => x.SaveId)
                .ToDictionary(g => g.Key, g => g.Select(x => x.Post).ToList());
        }

        public async Task UnlinkSave(Guid saveId)
        {
            var posts = await postRepository.FindAsync(new RepositoryGetParams<PostModel>()
            {
                Filter = p => p.Cards.Any(c => c.SaveId == saveId),
                IncludeProperties = "Cards",
                Take = int.MaxValue,
            });
            foreach (var card in posts.SelectMany(p => p.Cards).Where(c => c.SaveId == saveId))
                card.SaveId = null;
            await postRepository.SaveChangeAsync();
        }

        public async Task<PostModel> UpdatePost(PostModel post, string description, IReadOnlyList<string> tags, IReadOnlyList<PostCard> cards)
        {
            post.Description = description;
            post.Updated = DateTime.Now;
            ReplaceTags(post, tags);
            ReplaceCards(post, cards);
            ReplaceImages(post, cards);
            await postRepository.SaveChangeAsync();
            return post;
        }

        public async Task RemovePost(PostModel post)
        {
            post.IsRemoved = true;
            await postRepository.SaveChangeAsync();
        }

        private static void ReplaceTags(PostModel post, IReadOnlyList<string> tags)
        {
            var wanted = tags.Distinct().ToList();
            foreach (var tag in post.Tags.Where(t => !wanted.Contains(t.TagName)).ToList())
                post.Tags.Remove(tag);
            var existing = post.Tags.Select(t => t.TagName).ToHashSet();
            foreach (var name in wanted.Where(name => !existing.Contains(name)))
                post.Tags.Add(new Tag { Id = Guid.Empty, TagName = name });
        }

        private static void ReplaceCards(PostModel post, IReadOnlyList<PostCard> cards)
        {
            foreach (var card in post.Cards.Where(c => !cards.Contains(c)).ToList())
                post.Cards.Remove(card);
            for (var position = 0; position < cards.Count; position++)
            {
                cards[position].Position = position;
                if (!post.Cards.Contains(cards[position])) post.Cards.Add(cards[position]);
            }
        }

        private static void ReplaceImages(PostModel post, IReadOnlyList<PostCard> cards)
        {
            var images = post.ImageAttaches.Where(i => i.Status != AssetStatus.Deleted).ToList();
            for (var i = 0; i < cards.Count; i++)
            {
                if (i < images.Count)
                {
                    if (images[i].Url == cards[i].ImageUrl) continue;
                    images[i].Url = cards[i].ImageUrl;
                    images[i].LastUpdated = DateTime.Now;
                }
                else
                {
                    post.ImageAttaches.Add(new ImageObj { Url = cards[i].ImageUrl });
                }
            }
            foreach (var image in images.Skip(cards.Count))
                post.ImageAttaches.Remove(image);
        }

        public Task<IReadOnlyCollection<Guid>> GetPostIdsWithCards(IReadOnlyCollection<Guid> postIds) =>
            postRepository.GetPostIdsWithCards(postIds);

    }
}
