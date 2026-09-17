using Server.Features.Comment.Repository;
using Server.Tests.Features.SaveInfo;
using CommentModel = Server.Shared.Model.Comment;

namespace Server.Tests.Features.Comment.Repository
{
    public class CommentRepositoryTest
    {
        [Fact]
        public async Task GetCommentCount_CountsOnlyCommentsForTheRequestedPost()
        {
            var db = MockDatabase.CreateDbConnection();
            var targetPostId = Guid.NewGuid();
            var otherPostId = Guid.NewGuid();

            db.Comment.AddRange(
                new CommentModel { PostId = targetPostId, UserId = Guid.NewGuid() },
                new CommentModel { PostId = targetPostId, UserId = Guid.NewGuid() },
                new CommentModel { PostId = targetPostId, UserId = Guid.NewGuid() },
                new CommentModel { PostId = otherPostId, UserId = Guid.NewGuid() });
            await db.SaveChangesAsync();
            db.ChangeTracker.Clear();

            var repository = new CommentRepository(db);
            var result = repository.GetCommentCount(targetPostId);

            Assert.Equal(3, result);
        }
    }
}
