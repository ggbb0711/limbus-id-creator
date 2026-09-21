using Moq;
using Server.Features.Comment.Repository;
using Server.Features.Post.Enum;
using Server.Features.Post.Repository;
using Server.Features.Post.Service;
using Server.Shared.Http;
using Server.Shared.Model;
using PostModel = Server.Shared.Model.Post;

namespace Server.Tests.Features.Post.Service
{
    public class PostServiceTest
    {
        private static PostModel CreatePost(
            string title = "Some Title", Guid? userId = null, bool isActive = true, bool isRemoved = false,
            DateTime? created = null, List<Tag>? tags = null) => new()
        {
            Id = Guid.NewGuid(),
            Title = title,
            UserId = userId ?? Guid.NewGuid(),
            IsActive = isActive,
            IsRemoved = isRemoved,
            Created = created ?? DateTime.Now,
            Tags = tags ?? [],
        };

        private static void SetupFindAsync(Mock<IPostRepository> repository, List<PostModel> allPosts)
        {
            repository
                .Setup(r => r.FindAsync(It.IsAny<RepositoryGetParams<PostModel>>()))
                .Returns((RepositoryGetParams<PostModel> p) =>
                {
                    IQueryable<PostModel> query = allPosts.AsQueryable();
                    if (p.Filter != null) query = query.Where(p.Filter);
                    if (p.OrderBy != null) query = p.OrderBy(query);
                    return Task.FromResult(query.Skip(p.Skip).Take(p.Take).AsEnumerable());
                });
        }

        [Fact]
        public async Task GetPostById_ReturnsPost_WhenFound()
        {
            var post = CreatePost();
            var postRepository = new Mock<IPostRepository>();
            var commentRepository = new Mock<ICommentRepository>();
            postRepository.Setup(r => r.GetByIdAsync(post.Id)).ReturnsAsync(post);

            var service = new PostService(postRepository.Object, commentRepository.Object);
            var result = await service.GetPostById(post.Id);

            Assert.Same(post, result);
        }

        [Fact]
        public async Task GetPostById_ReturnsNull_WhenNotFound()
        {
            var id = Guid.NewGuid();
            var postRepository = new Mock<IPostRepository>();
            var commentRepository = new Mock<ICommentRepository>();
            postRepository.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((PostModel?)null);

            var service = new PostService(postRepository.Object, commentRepository.Object);
            var result = await service.GetPostById(id);

            Assert.Null(result);
        }

        [Fact]
        public async Task CreatePost_AddsAndSaves_ReturnsAddedPost()
        {
            var newPost = CreatePost();
            var addedPost = CreatePost();
            var postRepository = new Mock<IPostRepository>();
            var commentRepository = new Mock<ICommentRepository>();
            postRepository.Setup(r => r.AddAsync(newPost)).ReturnsAsync(addedPost);
            postRepository.Setup(r => r.SaveChangeAsync()).Returns(Task.CompletedTask);

            var service = new PostService(postRepository.Object, commentRepository.Object);
            var result = await service.CreatePost(newPost);

            Assert.Same(addedPost, result);
            postRepository.Verify(r => r.AddAsync(newPost), Times.Once);
            postRepository.Verify(r => r.SaveChangeAsync(), Times.Once);
        }

        [Fact]
        public void GetPostCount_ReturnsRepositoryResult()
        {
            var option = new SearchPostOption();
            var postRepository = new Mock<IPostRepository>();
            var commentRepository = new Mock<ICommentRepository>();
            postRepository.Setup(r => r.GetPostCount(option)).Returns(7);

            var service = new PostService(postRepository.Object, commentRepository.Object);
            var result = service.GetPostCount(option);

            Assert.Equal(7, result);
        }

        [Fact]
        public async Task FindPosts_IncludesAllPosts_RegardlessOfTitleOption()
        {
            var matching = CreatePost(title: "Reforged Ishmael");
            var nonMatching = CreatePost(title: "Completely Different");
            var postRepository = new Mock<IPostRepository>();
            var commentRepository = new Mock<ICommentRepository>();
            SetupFindAsync(postRepository, [matching, nonMatching]);

            var service = new PostService(postRepository.Object, commentRepository.Object);
            var result = await service.FindPosts(new SearchPostOption { limit = 10 });

            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task FindPosts_FiltersByUserId_WhenUserIdIsNotEmpty()
        {
            var targetUserId = Guid.NewGuid();
            var owned = CreatePost(userId: targetUserId);
            var other = CreatePost(userId: Guid.NewGuid());
            var postRepository = new Mock<IPostRepository>();
            var commentRepository = new Mock<ICommentRepository>();
            SetupFindAsync(postRepository, [owned, other]);

            var service = new PostService(postRepository.Object, commentRepository.Object);
            var result = await service.FindPosts(new SearchPostOption { UserId = targetUserId, limit = 10 });

            var found = Assert.Single(result);
            Assert.Equal(owned.Id, found.Id);
        }

        [Fact]
        public async Task FindPosts_RequiresAllRequestedTagsToBePresent()
        {
            var withBothTags = CreatePost(tags: [new Tag { TagName = "wrath" }, new Tag { TagName = "gloom" }]);
            var withOnlyOneTag = CreatePost(tags: [new Tag { TagName = "wrath" }]);
            var postRepository = new Mock<IPostRepository>();
            var commentRepository = new Mock<ICommentRepository>();
            SetupFindAsync(postRepository, [withBothTags, withOnlyOneTag]);

            var service = new PostService(postRepository.Object, commentRepository.Object);
            var result = await service.FindPosts(new SearchPostOption { Tag = ["wrath", "gloom"], limit = 10 });

            var found = Assert.Single(result);
            Assert.Equal(withBothTags.Id, found.Id);
        }

        [Fact]
        public async Task FindPosts_ExcludesRemovedAndInactivePosts()
        {
            var active = CreatePost();
            var removed = CreatePost(isRemoved: true);
            var inactive = CreatePost(isActive: false);
            var postRepository = new Mock<IPostRepository>();
            var commentRepository = new Mock<ICommentRepository>();
            SetupFindAsync(postRepository, [active, removed, inactive]);

            var service = new PostService(postRepository.Object, commentRepository.Object);
            var result = await service.FindPosts(new SearchPostOption { limit = 10 });

            var found = Assert.Single(result);
            Assert.Equal(active.Id, found.Id);
        }

        [Fact]
        public async Task FindPosts_AppliesSkipAndTake_BasedOnPageAndLimit()
        {
            var posts = Enumerable.Range(0, 5)
                .Select(i => CreatePost(created: new DateTime(2024, 1, 1).AddDays(i)))
                .ToList();
            var postRepository = new Mock<IPostRepository>();
            var commentRepository = new Mock<ICommentRepository>();
            SetupFindAsync(postRepository, posts);

            var service = new PostService(postRepository.Object, commentRepository.Object);
            var result = await service.FindPosts(new SearchPostOption { SortedBy = PostSortOption.Earliest, page = 1, limit = 2 });

            Assert.Equal([posts[2].Id, posts[3].Id], result.Select(p => p.Id));
        }

        [Fact]
        public async Task FindPosts_SortsByTitle_WhenSortOptionIsTitle()
        {
            var postB = CreatePost(title: "Bravo");
            var postA = CreatePost(title: "Alpha");
            var postC = CreatePost(title: "Charlie");
            var postRepository = new Mock<IPostRepository>();
            var commentRepository = new Mock<ICommentRepository>();
            SetupFindAsync(postRepository, [postB, postA, postC]);

            var service = new PostService(postRepository.Object, commentRepository.Object);
            var result = await service.FindPosts(new SearchPostOption { SortedBy = PostSortOption.Title, limit = 10 });

            Assert.Equal([postA.Id, postB.Id, postC.Id], result.Select(p => p.Id));
        }

        [Fact]
        public async Task FindPosts_SortsByCreatedAscending_WhenSortOptionIsEarliest()
        {
            var oldest = CreatePost(created: new DateTime(2020, 1, 1));
            var newest = CreatePost(created: new DateTime(2024, 1, 1));
            var postRepository = new Mock<IPostRepository>();
            var commentRepository = new Mock<ICommentRepository>();
            SetupFindAsync(postRepository, [newest, oldest]);

            var service = new PostService(postRepository.Object, commentRepository.Object);
            var result = await service.FindPosts(new SearchPostOption { SortedBy = PostSortOption.Earliest, limit = 10 });

            Assert.Equal([oldest.Id, newest.Id], result.Select(p => p.Id));
        }

        [Theory]
        [InlineData(PostSortOption.Latest)]
        public async Task FindPosts_SortsByCreatedDescending_ForLatestOrNewest(PostSortOption sortOption)
        {
            var oldest = CreatePost(created: new DateTime(2020, 1, 1));
            var newest = CreatePost(created: new DateTime(2024, 1, 1));
            var postRepository = new Mock<IPostRepository>();
            var commentRepository = new Mock<ICommentRepository>();
            SetupFindAsync(postRepository, [oldest, newest]);

            var service = new PostService(postRepository.Object, commentRepository.Object);
            var result = await service.FindPosts(new SearchPostOption { SortedBy = sortOption, limit = 10 });

            Assert.Equal([newest.Id, oldest.Id], result.Select(p => p.Id));
        }

        [Fact]
        public async Task FindPosts_SortsByMostCommented_UsingCommentRepositoryPerPost()
        {
            var lessCommented = CreatePost();
            var mostCommented = CreatePost();
            var postRepository = new Mock<IPostRepository>();
            var commentRepository = new Mock<ICommentRepository>();
            commentRepository.Setup(r => r.GetCommentCount(lessCommented.Id)).Returns(1);
            commentRepository.Setup(r => r.GetCommentCount(mostCommented.Id)).Returns(5);
            SetupFindAsync(postRepository, [lessCommented, mostCommented]);

            var service = new PostService(postRepository.Object, commentRepository.Object);
            var result = await service.FindPosts(new SearchPostOption { SortedBy = PostSortOption.MostCommented, limit = 10 });

            Assert.Equal([mostCommented.Id, lessCommented.Id], result.Select(p => p.Id));
        }

        [Fact]
        public async Task FindPosts_MostViewedSort_CallsPostRepositoryGetPostCount_WithoutThrowing()
        {
            var post1 = CreatePost();
            var post2 = CreatePost();
            var option = new SearchPostOption { SortedBy = PostSortOption.MostViewed, limit = 10 };
            var postRepository = new Mock<IPostRepository>();
            var commentRepository = new Mock<ICommentRepository>();
            postRepository.Setup(r => r.GetPostCount(option)).Returns(3);
            SetupFindAsync(postRepository, [post1, post2]);

            var service = new PostService(postRepository.Object, commentRepository.Object);
            var result = await service.FindPosts(option);

            Assert.Equal(2, result.Count);
            postRepository.Verify(r => r.GetPostCount(option), Times.AtLeastOnce);
        }
    }
}
