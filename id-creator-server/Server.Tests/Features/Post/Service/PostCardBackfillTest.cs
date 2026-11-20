using AutoFixture;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Moq;
using Server.Features.Images.Enum;
using Server.Features.Post.Service;
using Server.Features.SaveInfo.DTO;
using Server.Features.SaveInfo.Repository;
using Server.Features.SaveInfo.Service;
using Server.Shared.Database;
using Server.Shared.Model;
using Server.Tests.Features.SaveInfo;
using PostModel = Server.Shared.Model.Post;

namespace Server.Tests.Features.Post.Service
{
    public class PostCardBackfillTest
    {
        private readonly Fixture _fixture = new();
        private readonly ServerDbContext _db = MockDatabase.CreateDbConnection();

        private PostCardBackfill CreateBackfill()
        {
            var mapper = new MapperConfiguration(cfg => cfg.AddProfile<SaveInfoProfile>()).CreateMapper();
            var builder = new PostCardBuilder(
                new Mock<ISavedInfoService<SavedIDInfo, SavedId>>().Object,
                new Mock<ISavedInfoService<SavedEGOInfo, SavedEgo>>().Object,
                mapper);
            return new PostCardBackfill(_db,
                new SaveInfoRepository<SavedIDInfo, SavedId>(_db),
                new SaveInfoRepository<SavedEGOInfo, SavedEgo>(_db),
                builder);
        }

        private async Task<PostModel> AddPost(Guid userId, params string[] urls)
        {
            var post = new PostModel
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Title = "Post",
                ImageAttaches = [.. urls.Select(u => new ImageObj { Id = Guid.NewGuid(), Url = u, Status = AssetStatus.Uploaded })],
            };
            _db.Post.Add(post);
            await _db.SaveChangesAsync();
            return post;
        }

        [Fact]
        public async Task RunAsync_CopiesTheAuthorsMatchingSaves()
        {
            var author = Guid.NewGuid();
            var id = PostCardTestData.IdSave(_fixture, author, "https://cdn.test/id.png");
            var ego = PostCardTestData.EgoSave(_fixture, author, "https://cdn.test/ego.png");
            _db.SavedIDInfos.Add(id);
            _db.SavedEGOInfos.Add(ego);
            await _db.SaveChangesAsync();
            var post = await AddPost(author, "https://cdn.test/id.png", "https://cdn.test/ego.png");
            _db.ChangeTracker.Clear();

            var report = await CreateBackfill().RunAsync(dryRun: false);

            Assert.Equal(new PostCardBackfillReport(1, 1, 0, 0, 2, 0), report);
            var cards = await _db.PostCard.Where(c => c.PostId == post.Id).OrderBy(c => c.Position).ToListAsync();
            Assert.Equal([0, 1], cards.Select(c => c.Position));
            Assert.Equal(PostCardKind.Identity, cards.Single(c => c.SaveId == id.Id).Kind);
            Assert.Equal(PostCardKind.Ego, cards.Single(c => c.SaveId == ego.Id).Kind);
        }

        [Fact]
        public async Task RunAsync_IgnoresOtherUsersSavesAndUnmatchedImages()
        {
            var author = Guid.NewGuid();
            var stranger = PostCardTestData.IdSave(_fixture, Guid.NewGuid(), "https://cdn.test/shared.png");
            var own = PostCardTestData.IdSave(_fixture, author, "https://cdn.test/own.png");
            _db.SavedIDInfos.AddRange(stranger, own);
            await _db.SaveChangesAsync();
            await AddPost(author, "https://cdn.test/own.png", "https://cdn.test/shared.png");
            await AddPost(author, "https://cdn.test/gone.png");
            _db.ChangeTracker.Clear();

            var report = await CreateBackfill().RunAsync(dryRun: false);

            Assert.Equal(new PostCardBackfillReport(2, 0, 1, 1, 1, 0), report);
            Assert.Equal(own.Id, (await _db.PostCard.SingleAsync()).SaveId);
        }

        [Fact]
        public async Task RunAsync_DryRunReportsWithoutWriting()
        {
            var author = Guid.NewGuid();
            _db.SavedIDInfos.Add(PostCardTestData.IdSave(_fixture, author, "https://cdn.test/id.png"));
            await _db.SaveChangesAsync();
            await AddPost(author, "https://cdn.test/id.png");
            _db.ChangeTracker.Clear();

            var report = await CreateBackfill().RunAsync(dryRun: true);

            Assert.Equal(new PostCardBackfillReport(1, 1, 0, 0, 0, 0), report);
            Assert.Empty(await _db.PostCard.ToListAsync());
        }

        [Fact]
        public async Task RunAsync_SkipsPostsThatAlreadyHaveCards()
        {
            var author = Guid.NewGuid();
            _db.SavedIDInfos.Add(PostCardTestData.IdSave(_fixture, author, "https://cdn.test/id.png"));
            await _db.SaveChangesAsync();
            await AddPost(author, "https://cdn.test/id.png");
            _db.ChangeTracker.Clear();

            await CreateBackfill().RunAsync(dryRun: false);
            _db.ChangeTracker.Clear();
            var second = await CreateBackfill().RunAsync(dryRun: false);

            Assert.Equal(new PostCardBackfillReport(0, 0, 0, 0, 0, 0), second);
            Assert.Single(await _db.PostCard.ToListAsync());
        }

        [Fact]
        public async Task RunAsync_CountsSavesWithPendingImagesAsSkipped()
        {
            var author = Guid.NewGuid();
            var save = PostCardTestData.IdSave(_fixture, author, "https://cdn.test/id.png");
            save.Saved.SinnerIcon.Status = AssetStatus.Pending;
            _db.SavedIDInfos.Add(save);
            await _db.SaveChangesAsync();
            await AddPost(author, "https://cdn.test/id.png");
            _db.ChangeTracker.Clear();

            var report = await CreateBackfill().RunAsync(dryRun: false);

            Assert.Equal(new PostCardBackfillReport(1, 0, 0, 1, 0, 1), report);
        }
    }
}
