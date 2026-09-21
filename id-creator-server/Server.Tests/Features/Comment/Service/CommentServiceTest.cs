using Moq;
using Server.Features.Comment.Repository;
using Server.Features.Comment.Service;
using Server.Shared.Http;
using CommentModel = Server.Shared.Model.Comment;

namespace Server.Tests.Features.Comment.Service
{
    public class CommentServiceTest
    {
        private static CommentModel CreateComment(Guid? postId = null, DateTime? created = null) => new()
        {
            Id = Guid.NewGuid(),
            PostId = postId ?? Guid.NewGuid(),
            Created = created ?? DateTime.Now,
        };

        private static void SetupFindAsync(Mock<ICommentRepository> repository, List<CommentModel> allComments)
        {
            repository
                .Setup(r => r.FindAsync(It.IsAny<RepositoryGetParams<CommentModel>>()))
                .Returns((RepositoryGetParams<CommentModel> p) =>
                {
                    IQueryable<CommentModel> query = allComments.AsQueryable();
                    if (p.Filter != null) query = query.Where(p.Filter);
                    if (p.OrderBy != null) query = p.OrderBy(query);
                    return Task.FromResult(query.Skip(p.Skip).Take(p.Take).AsEnumerable());
                });
        }

        [Fact]
        public async Task GetCommentById_ReturnsComment_WhenFound()
        {
            var comment = CreateComment();
            var repository = new Mock<ICommentRepository>();
            repository.Setup(r => r.GetByIdAsync(comment.Id)).ReturnsAsync(comment);

            var service = new CommentService(repository.Object);
            var result = await service.GetCommentById(comment.Id);

            Assert.Same(comment, result);
        }

        [Fact]
        public async Task GetCommentById_ReturnsNull_WhenNotFound()
        {
            var id = Guid.NewGuid();
            var repository = new Mock<ICommentRepository>();
            repository.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((CommentModel?)null);

            var service = new CommentService(repository.Object);
            var result = await service.GetCommentById(id);

            Assert.Null(result);
        }

        [Fact]
        public async Task CreateComment_AddsAndSaves_ReturnsAddedComment()
        {
            var newComment = CreateComment();
            var addedComment = CreateComment();
            var repository = new Mock<ICommentRepository>();
            repository.Setup(r => r.AddAsync(newComment)).ReturnsAsync(addedComment);
            repository.Setup(r => r.SaveChangeAsync()).Returns(Task.CompletedTask);

            var service = new CommentService(repository.Object);
            var result = await service.CreateComment(newComment);

            Assert.Same(addedComment, result);
            repository.Verify(r => r.AddAsync(newComment), Times.Once);
            repository.Verify(r => r.SaveChangeAsync(), Times.Once);
        }

        [Fact]
        public void GetCommentCount_ReturnsRepositoryResult()
        {
            var postId = Guid.NewGuid();
            var repository = new Mock<ICommentRepository>();
            repository.Setup(r => r.GetCommentCount(postId)).Returns(6);

            var service = new CommentService(repository.Object);
            var result = service.GetCommentCount(postId);

            Assert.Equal(6, result);
        }

        [Fact]
        public async Task FindComments_ReturnsOnlyCommentsForRequestedPost()
        {
            var targetPostId = Guid.NewGuid();
            var matching = CreateComment(postId: targetPostId);
            var other = CreateComment(postId: Guid.NewGuid());
            var repository = new Mock<ICommentRepository>();
            SetupFindAsync(repository, [matching, other]);

            var service = new CommentService(repository.Object);
            var result = await service.FindComments(new SearchCommentOption { PostId = targetPostId, Limit = 10 });

            var found = Assert.Single(result);
            Assert.Equal(matching.Id, found.Id);
        }

        [Fact]
        public async Task FindComments_ReturnsEmptyList_WhenNoCommentsMatchPostId()
        {
            var other = CreateComment(postId: Guid.NewGuid());
            var repository = new Mock<ICommentRepository>();
            SetupFindAsync(repository, [other]);

            var service = new CommentService(repository.Object);
            var result = await service.FindComments(new SearchCommentOption { PostId = Guid.NewGuid(), Limit = 10 });

            Assert.Empty(result);
        }

        [Fact]
        public async Task FindComments_SortsByCreatedAscending()
        {
            var postId = Guid.NewGuid();
            var newer = CreateComment(postId: postId, created: new DateTime(2024, 1, 1));
            var older = CreateComment(postId: postId, created: new DateTime(2020, 1, 1));
            var repository = new Mock<ICommentRepository>();
            SetupFindAsync(repository, [newer, older]);

            var service = new CommentService(repository.Object);
            var result = await service.FindComments(new SearchCommentOption { PostId = postId, Limit = 10 });

            Assert.Equal([older.Id, newer.Id], result.Select(c => c.Id));
        }

        [Fact]
        public async Task FindComments_AppliesSkipAndTake_BasedOnPageAndLimit()
        {
            var postId = Guid.NewGuid();
            var comments = Enumerable.Range(0, 5)
                .Select(i => CreateComment(postId: postId, created: new DateTime(2024, 1, 1).AddDays(i)))
                .ToList();
            var repository = new Mock<ICommentRepository>();
            SetupFindAsync(repository, comments);

            var service = new CommentService(repository.Object);
            var result = await service.FindComments(new SearchCommentOption { PostId = postId, Page = 1, Limit = 2 });

            Assert.Equal([comments[2].Id, comments[3].Id], result.Select(c => c.Id));
        }
    }
}
