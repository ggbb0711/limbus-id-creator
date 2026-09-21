using Server.Features.Post.Repository;
using Server.Shared.Model;
using Server.Tests.Features.SaveInfo;

namespace Server.Tests.Features.Post.Repository
{
    public class PostViewRepositoryTest
    {
        [Fact]
        public async Task GetViewCount_CountsOnlyViewsForTheRequestedPost()
        {
            var db = MockDatabase.CreateDbConnection();
            var targetPostId = Guid.NewGuid();
            var otherPostId = Guid.NewGuid();

            db.PostView.AddRange(
                new PostView { PostId = targetPostId, UserId = Guid.NewGuid() },
                new PostView { PostId = targetPostId, UserId = Guid.NewGuid() },
                new PostView { PostId = targetPostId, UserId = null },
                new PostView { PostId = otherPostId, UserId = Guid.NewGuid() });
            await db.SaveChangesAsync();
            db.ChangeTracker.Clear();

            var repository = new PostViewRepository(db);
            var result = repository.GetViewCount(targetPostId);

            Assert.Equal(3, result);
        }
    }
}
