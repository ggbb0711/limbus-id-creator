using Microsoft.EntityFrameworkCore;
using Moq;
using Server.Features.Comment.Repository;
using Server.Features.Images.Enum;
using Server.Features.Post.Repository;
using Server.Features.Post.Service;
using Server.Shared.Database;
using Server.Shared.Database.Interceptor;
using Server.Shared.Model;
using PostModel = Server.Shared.Model.Post;

namespace Server.Tests.Features.Post.Service
{
    public class PostServiceUpdateTest
    {
        private readonly string _databaseName = Guid.NewGuid().ToString();

        private ServerDbContext CreateDb() => new(new DbContextOptionsBuilder<ServerDbContext>()
            .UseInMemoryDatabase(_databaseName)
            .AddInterceptors(new ImageInterceptor())
            .Options);

        private static PostService CreateService(ServerDbContext db) => new(new PostRepository(db), new Mock<ICommentRepository>().Object);

        private static PostCard Card(string url) => new() { Kind = PostCardKind.Identity, ImageUrl = url, SaveId = Guid.NewGuid() };

        private async Task<Guid> SeedPost()
        {
            using var db = CreateDb();
            var post = new PostModel
            {
                Title = "Original title",
                Description = "Old",
                Tags = [new Tag { TagName = "Identity" }, new Tag { TagName = "old" }],
                Cards = [Card("a"), Card("b"), Card("c")],
                ImageAttaches = [new ImageObj { Url = "a" }, new ImageObj { Url = "b" }, new ImageObj { Url = "c" }],
            };
            post.Cards.ElementAt(1).Position = 1;
            post.Cards.ElementAt(2).Position = 2;
            db.Post.Add(post);
            await db.SaveChangesAsync();
            return post.Id;
        }

        private async Task<PostModel> Load(ServerDbContext db, Guid id) =>
            await db.Post.Include(p => p.Cards).Include(p => p.Tags).SingleAsync(p => p.Id == id);

        [Fact]
        public async Task UpdatePost_UpdatesDescriptionTagsAndUpdatedButNotTitle()
        {
            var id = await SeedPost();
            using (var db = CreateDb())
            {
                var post = await Load(db, id);
                await CreateService(db).UpdatePost(post, "New", ["Identity", "new"], [.. post.Cards.OrderBy(c => c.Position)]);
            }

            using var check = CreateDb();
            var saved = await Load(check, id);
            Assert.Equal("Original title", saved.Title);
            Assert.Equal("New", saved.Description);
            Assert.NotNull(saved.Updated);
            Assert.Equal(["Identity", "new"], saved.Tags.Select(t => t.TagName).Order());
        }

        [Fact]
        public async Task UpdatePost_KeepsReordersAddsAndRemovesCards()
        {
            var id = await SeedPost();
            using (var db = CreateDb())
            {
                var post = await Load(db, id);
                var byUrl = post.Cards.ToDictionary(c => c.ImageUrl);
                await CreateService(db).UpdatePost(post, "", [], [byUrl["c"], Card("new"), byUrl["a"]]);
            }

            using var check = CreateDb();
            var saved = await Load(check, id);
            Assert.Equal(["c", "new", "a"], saved.Cards.OrderBy(c => c.Position).Select(c => c.ImageUrl));
            Assert.Equal([0, 1, 2], saved.Cards.OrderBy(c => c.Position).Select(c => c.Position));
            Assert.Equal(3, await check.PostCard.CountAsync());
        }

        [Fact]
        public async Task UpdatePost_ReusesImageRowsInCardOrder_AndDropsTheTail()
        {
            var id = await SeedPost();
            List<Guid> originalImageIds;
            using (var db = CreateDb())
            {
                var post = await Load(db, id);
                originalImageIds = [.. post.ImageAttaches.Select(i => i.Id)];
                var byUrl = post.Cards.ToDictionary(c => c.ImageUrl);
                await CreateService(db).UpdatePost(post, "", [], [byUrl["b"]]);
            }

            using var check = CreateDb();
            var saved = await Load(check, id);
            var active = saved.ImageAttaches.Where(i => i.Status != AssetStatus.Deleted).ToList();
            Assert.Equal(["b"], active.Select(i => i.Url));
            Assert.Contains(active[0].Id, originalImageIds);
        }

        [Fact]
        public async Task UpdatePost_AddsImageRows_WhenCardsAreAdded()
        {
            var id = await SeedPost();
            using (var db = CreateDb())
            {
                var post = await Load(db, id);
                await CreateService(db).UpdatePost(post, "", [], [.. post.Cards.OrderBy(c => c.Position), Card("d")]);
            }

            using var check = CreateDb();
            var saved = await Load(check, id);
            Assert.Equal(["a", "b", "c", "d"], saved.ImageAttaches.Where(i => i.Status != AssetStatus.Deleted).Select(i => i.Url).Order());
        }

        [Fact]
        public async Task RemovePost_SoftDeletesThePost()
        {
            var id = await SeedPost();
            using (var db = CreateDb())
            {
                await CreateService(db).RemovePost(await Load(db, id));
            }

            using var check = CreateDb();
            var saved = await Load(check, id);
            Assert.True(saved.IsRemoved);
            Assert.True(saved.IsHidden());
            Assert.Equal(3, saved.Cards.Count);
        }
    }
}
