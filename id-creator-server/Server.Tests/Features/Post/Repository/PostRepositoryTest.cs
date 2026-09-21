using Server.Features.Post.Repository;
using Server.Shared.Model;
using Server.Tests.Features.SaveInfo;
using PostModel = Server.Shared.Model.Post;

namespace Server.Tests.Features.Post.Repository
{
    public class PostRepositoryTest
    {
        [Fact]
        public async Task GetPostCount_CountsOnlyActiveNonRemovedPosts_MatchingTitleAndUserId()
        {
            var db = MockDatabase.CreateDbConnection();
            var targetUserId = Guid.NewGuid();

            var matching = new PostModel { Title = "Ishmael Reforged", UserId = targetUserId, IsActive = true, IsRemoved = false };
            var wrongTitle = new PostModel { Title = "Something Else", UserId = targetUserId, IsActive = true, IsRemoved = false };
            var wrongUser = new PostModel { Title = "Ishmael Reforged", UserId = Guid.NewGuid(), IsActive = true, IsRemoved = false };
            var removed = new PostModel { Title = "Ishmael Reforged", UserId = targetUserId, IsActive = true, IsRemoved = true };
            var inactive = new PostModel { Title = "Ishmael Reforged", UserId = targetUserId, IsActive = false, IsRemoved = false };

            db.Post.AddRange(matching, wrongTitle, wrongUser, removed, inactive);
            await db.SaveChangesAsync();
            db.ChangeTracker.Clear();

            var repository = new PostRepository(db);
            var result = repository.GetPostCount(new SearchPostOption { Title = "Ishmael", UserId = targetUserId });

            Assert.Equal(1, result);
        }
    }
}
