using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Server.Features.Comment.Service;
using Server.Features.Post;
using Server.Features.Post.DTO;
using Server.Features.Post.Repository;
using Server.Features.Post.Service;
using Server.Shared.Exception;
using Server.Shared.Http;
using Server.Shared.Model;
using PostModel = Server.Shared.Model.Post;
using UserModel = Server.Shared.Model.User;

namespace Server.Tests.Features.Post
{
    public class PostControllerTest
    {
        private static PostController CreateController(
            Mock<IPostService> postService, Mock<IPostViewService> postViewService,
            Mock<ICommentService> commentService, Mock<IMapper> mapper, Guid? userId = null,
            Mock<IPostCardBuilder>? cardBuilder = null)
        {
            var identity = userId.HasValue
                ? new ClaimsIdentity([new Claim(JwtRegisteredClaimNames.Sub, userId.Value.ToString())])
                : new ClaimsIdentity();

            return new PostController(postService.Object, postViewService.Object, commentService.Object,
                (cardBuilder ?? new Mock<IPostCardBuilder>()).Object, mapper.Object)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal(identity) },
                },
            };
        }

        [Fact]
        public async Task CreateNewPost_BuildsCardsAndImagesFromSaves_WhenAuthenticated()
        {
            var userId = Guid.NewGuid();
            var dto = new PostRequestDTO
            {
                Title = "New Post",
                Cards = [new PostCardRequestDTO { SaveId = Guid.NewGuid(), Kind = PostCardKind.Identity }, new PostCardRequestDTO { SaveId = Guid.NewGuid(), Kind = PostCardKind.Ego }],
            };
            var cards = new List<PostCard>
            {
                new() { Position = 0, Kind = PostCardKind.Identity, ImageUrl = "https://img/id.png" },
                new() { Position = 1, Kind = PostCardKind.Ego, ImageUrl = "https://img/ego.png" },
            };
            var mappedPost = new PostModel();
            var addedPost = new PostModel { Id = Guid.NewGuid() };
            var responseDto = new PostResponseDTO { Id = addedPost.Id };

            var postService = new Mock<IPostService>();
            var postViewService = new Mock<IPostViewService>();
            var commentService = new Mock<ICommentService>();
            var mapper = new Mock<IMapper>();
            var cardBuilder = new Mock<IPostCardBuilder>();
            mapper.Setup(m => m.Map<PostModel>(dto)).Returns(mappedPost);
            cardBuilder.Setup(b => b.BuildAsync(userId, dto.Cards)).ReturnsAsync(cards);
            postService.Setup(s => s.CreatePost(mappedPost)).ReturnsAsync(addedPost);
            mapper.Setup(m => m.Map<PostResponseDTO>(addedPost)).Returns(responseDto);

            var controller = CreateController(postService, postViewService, commentService, mapper, userId, cardBuilder);

            var result = await controller.CreateNewPost(dto);

            Assert.Equal(userId, mappedPost.UserId);
            Assert.Same(cards, mappedPost.Cards);
            Assert.Equal(["https://img/id.png", "https://img/ego.png"], mappedPost.ImageAttaches.Select(i => i.Url));
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equivalent(ApiResponse<PostResponseDTO>.Ok(responseDto, "Post created successfully"), okResult.Value);
            postService.Verify(s => s.CreatePost(mappedPost), Times.Once);
        }

        [Fact]
        public async Task CreateNewPost_DoesNotCreatePost_WhenCardBuilderRejectsASave()
        {
            var userId = Guid.NewGuid();
            var dto = new PostRequestDTO { Title = "New Post", Cards = [new PostCardRequestDTO { SaveId = Guid.NewGuid() }] };
            var postService = new Mock<IPostService>();
            var mapper = new Mock<IMapper>();
            var cardBuilder = new Mock<IPostCardBuilder>();
            mapper.Setup(m => m.Map<PostModel>(dto)).Returns(new PostModel());
            cardBuilder.Setup(b => b.BuildAsync(userId, dto.Cards)).ThrowsAsync(new ConflictException(ApiErrors.SaveImagesPending));

            var controller = CreateController(postService, new Mock<IPostViewService>(), new Mock<ICommentService>(), mapper, userId, cardBuilder);

            await Assert.ThrowsAsync<ConflictException>(() => controller.CreateNewPost(dto));
            postService.Verify(s => s.CreatePost(It.IsAny<PostModel>()), Times.Never);
        }

        [Fact]
        public async Task CreateNewPost_ThrowsUnauthorizedException_WhenSubClaimMissing()
        {
            var dto = new PostRequestDTO { Title = "New Post" };
            var postService = new Mock<IPostService>();
            var postViewService = new Mock<IPostViewService>();
            var commentService = new Mock<ICommentService>();
            var mapper = new Mock<IMapper>();

            var controller = CreateController(postService, postViewService, commentService, mapper, userId: null);

            await Assert.ThrowsAsync<UnauthorizedException>(() => controller.CreateNewPost(dto));

            postService.Verify(s => s.CreatePost(It.IsAny<PostModel>()), Times.Never);
        }

        [Fact]
        public async Task GetPost_ReturnsMappedPostWithViewAndCommentCounts_WhenFoundAndAuthenticated()
        {
            var postId = Guid.NewGuid();
            var userId = Guid.NewGuid();
            var foundPost = new PostModel { Id = postId };
            var responseDto = new PostResponseDTO { Id = postId };

            var postService = new Mock<IPostService>();
            var postViewService = new Mock<IPostViewService>();
            var commentService = new Mock<ICommentService>();
            var mapper = new Mock<IMapper>();
            postService.Setup(s => s.GetPostById(postId)).ReturnsAsync(foundPost);
            mapper.Setup(m => m.Map<PostResponseDTO>(foundPost)).Returns(responseDto);
            postViewService
                .Setup(s => s.LogView(It.Is<PostView>(v => v.PostId == postId && v.UserId == userId)))
                .ReturnsAsync(11);
            commentService.Setup(s => s.GetCommentCount(postId)).Returns(4);

            var controller = CreateController(postService, postViewService, commentService, mapper, userId);

            var result = await controller.GetPost(postId);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var response = Assert.IsType<ApiResponse<PostResponseDTO>>(okResult.Value);
            Assert.Equal(11, response.Data!.ViewCount);
            Assert.Equal(4, response.Data.CommentCount);
        }

        [Fact]
        public async Task GetPost_LogsViewWithEmptyUserId_WhenAnonymous()
        {
            var postId = Guid.NewGuid();
            var foundPost = new PostModel { Id = postId };
            var responseDto = new PostResponseDTO { Id = postId };

            var postService = new Mock<IPostService>();
            var postViewService = new Mock<IPostViewService>();
            var commentService = new Mock<ICommentService>();
            var mapper = new Mock<IMapper>();
            postService.Setup(s => s.GetPostById(postId)).ReturnsAsync(foundPost);
            mapper.Setup(m => m.Map<PostResponseDTO>(foundPost)).Returns(responseDto);
            postViewService
                .Setup(s => s.LogView(It.Is<PostView>(v => v.PostId == postId && v.UserId == Guid.Empty)))
                .ReturnsAsync(1);
            commentService.Setup(s => s.GetCommentCount(postId)).Returns(0);

            var controller = CreateController(postService, postViewService, commentService, mapper, userId: null);

            var result = await controller.GetPost(postId);

            Assert.IsType<OkObjectResult>(result.Result);
            postViewService.Verify(
                s => s.LogView(It.Is<PostView>(v => v.PostId == postId && v.UserId == Guid.Empty)),
                Times.Once);
        }

        [Fact]
        public async Task GetPost_ThrowsNotFoundException_WhenPostDoesNotExist()
        {
            var postId = Guid.NewGuid();
            var postService = new Mock<IPostService>();
            var postViewService = new Mock<IPostViewService>();
            var commentService = new Mock<ICommentService>();
            var mapper = new Mock<IMapper>();
            postService.Setup(s => s.GetPostById(postId)).ReturnsAsync((PostModel?)null);

            var controller = CreateController(postService, postViewService, commentService, mapper);

            await Assert.ThrowsAsync<NotFoundException>(() => controller.GetPost(postId));

            postViewService.Verify(s => s.LogView(It.IsAny<PostView>()), Times.Never);
            commentService.Verify(s => s.GetCommentCount(It.IsAny<Guid>()), Times.Never);
        }

        [Theory]
        [InlineData(true, true)]
        [InlineData(false, false)]
        public async Task GetPost_ThrowsGoneExceptionWithRemovedCode_WhenPostHidden(bool isRemoved, bool isActive)
        {
            var postId = Guid.NewGuid();
            var foundPost = new PostModel { Id = postId, IsRemoved = isRemoved, IsActive = isActive };
            var postService = new Mock<IPostService>();
            var postViewService = new Mock<IPostViewService>();
            var commentService = new Mock<ICommentService>();
            var mapper = new Mock<IMapper>();
            postService.Setup(s => s.GetPostById(postId)).ReturnsAsync(foundPost);

            var controller = CreateController(postService, postViewService, commentService, mapper);

            var exception = await Assert.ThrowsAsync<GoneException>(() => controller.GetPost(postId));
            Assert.Equal(ApiErrors.PostRemoved.Code, exception.ErrorCode);
            postViewService.Verify(s => s.LogView(It.IsAny<PostView>()), Times.Never);
        }

        [Fact]
        public async Task GetPost_ThrowsGoneExceptionWithAuthorBannedCode_WhenAuthorBanned()
        {
            var postId = Guid.NewGuid();
            var foundPost = new PostModel { Id = postId, User = new UserModel { IsActive = false } };
            var postService = new Mock<IPostService>();
            var postViewService = new Mock<IPostViewService>();
            var commentService = new Mock<ICommentService>();
            var mapper = new Mock<IMapper>();
            postService.Setup(s => s.GetPostById(postId)).ReturnsAsync(foundPost);

            var controller = CreateController(postService, postViewService, commentService, mapper);

            var exception = await Assert.ThrowsAsync<GoneException>(() => controller.GetPost(postId));
            Assert.Equal(ApiErrors.PostAuthorBanned.Code, exception.ErrorCode);
            postViewService.Verify(s => s.LogView(It.IsAny<PostView>()), Times.Never);
        }

        [Fact]
        public async Task GetPosts_ReturnsEmptyList_WithTotalFromGetPostCount()
        {
            var option = new SearchPostOption();
            var postService = new Mock<IPostService>();
            var postViewService = new Mock<IPostViewService>();
            var commentService = new Mock<ICommentService>();
            var mapper = new Mock<IMapper>();
            postService.Setup(s => s.FindPosts(option)).ReturnsAsync([]);
            postService.Setup(s => s.GetPostCount(option)).Returns(5);
            postService.Setup(s => s.GetPostIdsWithCards(It.IsAny<IReadOnlyCollection<Guid>>())).ReturnsAsync([]);

            var controller = CreateController(postService, postViewService, commentService, mapper);

            var result = await controller.GetPosts(option);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var response = Assert.IsType<ApiResponse<PostListResponseDTO>>(okResult.Value);
            Assert.Empty(response.Data!.List);
            Assert.Equal(5, response.Data.Total);
        }

        [Fact]
        public async Task GetPosts_PopulatesViewCommentCountsAndHasCards_ForEachPost()
        {
            var option = new SearchPostOption();
            var post1 = new PostModel { Id = Guid.NewGuid() };
            var post2 = new PostModel { Id = Guid.NewGuid() };

            var postService = new Mock<IPostService>();
            var postViewService = new Mock<IPostViewService>();
            var commentService = new Mock<ICommentService>();
            postService.Setup(s => s.FindPosts(option)).ReturnsAsync([post1, post2]);
            postService.Setup(s => s.GetPostCount(option)).Returns(2);
            postViewService.Setup(s => s.GetViewCount(post1.Id)).Returns(10);
            postViewService.Setup(s => s.GetViewCount(post2.Id)).Returns(20);
            commentService.Setup(s => s.GetCommentCount(post1.Id)).Returns(3);
            commentService.Setup(s => s.GetCommentCount(post2.Id)).Returns(4);
            postService.Setup(s => s.GetPostIdsWithCards(It.Is<IReadOnlyCollection<Guid>>(ids => ids.SequenceEqual(new[] { post1.Id, post2.Id }))))
                .ReturnsAsync([post2.Id]);
            var realMapper = new MapperConfiguration(cfg => cfg.AddProfile<PostProfile>()).CreateMapper();
            var mapper = new Mock<IMapper>();
            mapper.Setup(m => m.Map(It.IsAny<object>(), It.IsAny<Action<IMappingOperationOptions<object, PostListItemDTO>>>()))
                .Returns((object source, Action<IMappingOperationOptions<object, PostListItemDTO>> opts) => realMapper.Map(source, opts));

            var controller = CreateController(postService, postViewService, commentService, mapper);

            var result = await controller.GetPosts(option);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var response = Assert.IsType<ApiResponse<PostListResponseDTO>>(okResult.Value);
            Assert.Equal(2, response.Data!.Total);
            var first = Assert.Single(response.Data.List, p => p.Id == post1.Id);
            Assert.Equal(10, first.ViewCount);
            Assert.Equal(3, first.CommentCount);
            Assert.False(first.HasCards);
            var second = Assert.Single(response.Data.List, p => p.Id == post2.Id);
            Assert.Equal(20, second.ViewCount);
            Assert.Equal(4, second.CommentCount);
            Assert.True(second.HasCards);
        }

        private static PostModel OwnedPost(Guid ownerId, params PostCard[] cards) =>
            new() { Id = Guid.NewGuid(), UserId = ownerId, Title = "Title", Cards = [.. cards] };

        private static PostController OwnerController(Mock<IPostService> postService, Guid userId, Mock<IPostCardBuilder>? cardBuilder = null, Mock<IMapper>? mapper = null) =>
            CreateController(postService, new Mock<IPostViewService>(), new Mock<ICommentService>(), mapper ?? new Mock<IMapper>(), userId, cardBuilder);

        [Fact]
        public async Task UpdatePost_ThrowsUnauthorized_WhenSubClaimMissing()
        {
            var postService = new Mock<IPostService>();
            var controller = CreateController(postService, new Mock<IPostViewService>(), new Mock<ICommentService>(), new Mock<IMapper>());

            await Assert.ThrowsAsync<UnauthorizedException>(() => controller.UpdatePost(Guid.NewGuid(), new PostUpdateRequestDTO()));
            postService.Verify(s => s.GetPostById(It.IsAny<Guid>()), Times.Never);
        }

        [Fact]
        public async Task UpdatePost_ThrowsNotFound_WhenPostMissing()
        {
            var postService = new Mock<IPostService>();
            postService.Setup(s => s.GetPostById(It.IsAny<Guid>())).ReturnsAsync((PostModel?)null);

            await Assert.ThrowsAsync<NotFoundException>(() => OwnerController(postService, Guid.NewGuid()).UpdatePost(Guid.NewGuid(), new PostUpdateRequestDTO()));
        }

        [Fact]
        public async Task UpdatePost_ThrowsGone_WhenPostHidden()
        {
            var userId = Guid.NewGuid();
            var post = OwnedPost(userId);
            post.IsRemoved = true;
            var postService = new Mock<IPostService>();
            postService.Setup(s => s.GetPostById(post.Id)).ReturnsAsync(post);

            await Assert.ThrowsAsync<GoneException>(() => OwnerController(postService, userId).UpdatePost(post.Id, new PostUpdateRequestDTO()));
        }

        [Fact]
        public async Task UpdatePost_ThrowsForbidden_WhenNotTheAuthor()
        {
            var post = OwnedPost(Guid.NewGuid());
            var postService = new Mock<IPostService>();
            postService.Setup(s => s.GetPostById(post.Id)).ReturnsAsync(post);

            var exception = await Assert.ThrowsAsync<ForbiddenException>(() => OwnerController(postService, Guid.NewGuid()).UpdatePost(post.Id, new PostUpdateRequestDTO()));
            Assert.Equal(ApiErrors.ResourceNotOwned.Code, exception.ErrorCode);
            postService.Verify(s => s.UpdatePost(It.IsAny<PostModel>(), It.IsAny<string>(), It.IsAny<IReadOnlyList<string>>(), It.IsAny<IReadOnlyList<PostCard>>()), Times.Never);
        }

        [Fact]
        public async Task UpdatePost_ThrowsBadRequest_WhenCardIdIsNotInThePost()
        {
            var userId = Guid.NewGuid();
            var post = OwnedPost(userId, new PostCard { Id = Guid.NewGuid() });
            var postService = new Mock<IPostService>();
            postService.Setup(s => s.GetPostById(post.Id)).ReturnsAsync(post);
            var body = new PostUpdateRequestDTO { Cards = [new PostCardUpdateDTO { CardId = Guid.NewGuid() }] };

            var exception = await Assert.ThrowsAsync<BadRequestException>(() => OwnerController(postService, userId).UpdatePost(post.Id, body));
            Assert.Equal(ApiErrors.PostCardNotFound.Code, exception.ErrorCode);
        }

        [Fact]
        public async Task UpdatePost_KeepsExistingCardsAndBuildsNewOnesInRequestOrder()
        {
            var userId = Guid.NewGuid();
            var kept = new PostCard { Id = Guid.NewGuid(), Position = 0, ImageUrl = "kept" };
            var dropped = new PostCard { Id = Guid.NewGuid(), Position = 1, ImageUrl = "dropped" };
            var post = OwnedPost(userId, kept, dropped);
            var saveId = Guid.NewGuid();
            var built = new PostCard { ImageUrl = "built" };
            var body = new PostUpdateRequestDTO
            {
                Description = "New",
                Tags = ["tag"],
                Cards = [new PostCardUpdateDTO { SaveId = saveId, Kind = PostCardKind.Ego }, new PostCardUpdateDTO { CardId = kept.Id }],
            };
            var postService = new Mock<IPostService>();
            var cardBuilder = new Mock<IPostCardBuilder>();
            var mapper = new Mock<IMapper>();
            postService.Setup(s => s.GetPostById(post.Id)).ReturnsAsync(post);
            cardBuilder.Setup(b => b.BuildAsync(userId, It.Is<IReadOnlyList<PostCardRequestDTO>>(r => r.Single().SaveId == saveId && r.Single().Kind == PostCardKind.Ego)))
                .ReturnsAsync([built]);
            postService.Setup(s => s.UpdatePost(post, "New", body.Tags, It.IsAny<IReadOnlyList<PostCard>>())).ReturnsAsync(post);
            mapper.Setup(m => m.Map<PostResponseDTO>(post)).Returns(new PostResponseDTO { Id = post.Id, Title = "Title" });

            var result = await OwnerController(postService, userId, cardBuilder, mapper).UpdatePost(post.Id, body);

            postService.Verify(s => s.UpdatePost(post, "New", body.Tags, It.Is<IReadOnlyList<PostCard>>(c => c.SequenceEqual(new[] { built, kept }))), Times.Once);
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var response = Assert.IsType<ApiResponse<PostResponseDTO>>(okResult.Value);
            Assert.Equal("Title", response.Data!.Title);
        }

        [Fact]
        public async Task UpdatePost_DoesNotSave_WhenCardBuilderRejectsASave()
        {
            var userId = Guid.NewGuid();
            var post = OwnedPost(userId);
            var postService = new Mock<IPostService>();
            var cardBuilder = new Mock<IPostCardBuilder>();
            postService.Setup(s => s.GetPostById(post.Id)).ReturnsAsync(post);
            cardBuilder.Setup(b => b.BuildAsync(userId, It.IsAny<IReadOnlyList<PostCardRequestDTO>>())).ThrowsAsync(new ConflictException(ApiErrors.SaveImagesPending));
            var body = new PostUpdateRequestDTO { Cards = [new PostCardUpdateDTO { SaveId = Guid.NewGuid(), Kind = PostCardKind.Identity }] };

            await Assert.ThrowsAsync<ConflictException>(() => OwnerController(postService, userId, cardBuilder).UpdatePost(post.Id, body));
            postService.Verify(s => s.UpdatePost(It.IsAny<PostModel>(), It.IsAny<string>(), It.IsAny<IReadOnlyList<string>>(), It.IsAny<IReadOnlyList<PostCard>>()), Times.Never);
        }

        [Fact]
        public async Task DeletePost_SoftDeletes_WhenAuthor()
        {
            var userId = Guid.NewGuid();
            var post = OwnedPost(userId);
            var postService = new Mock<IPostService>();
            postService.Setup(s => s.GetPostById(post.Id)).ReturnsAsync(post);

            var result = await OwnerController(postService, userId).DeletePost(post.Id);

            postService.Verify(s => s.RemovePost(post), Times.Once);
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equivalent(ApiResponse<Guid>.Ok(post.Id, "Post deleted successfully"), okResult.Value);
        }

        [Fact]
        public async Task DeletePost_ThrowsUnauthorized_WhenSubClaimMissing()
        {
            var postService = new Mock<IPostService>();
            var controller = CreateController(postService, new Mock<IPostViewService>(), new Mock<ICommentService>(), new Mock<IMapper>());

            await Assert.ThrowsAsync<UnauthorizedException>(() => controller.DeletePost(Guid.NewGuid()));
            postService.Verify(s => s.RemovePost(It.IsAny<PostModel>()), Times.Never);
        }

        [Fact]
        public async Task DeletePost_ThrowsForbidden_WhenNotTheAuthor()
        {
            var post = OwnedPost(Guid.NewGuid());
            var postService = new Mock<IPostService>();
            postService.Setup(s => s.GetPostById(post.Id)).ReturnsAsync(post);

            await Assert.ThrowsAsync<ForbiddenException>(() => OwnerController(postService, Guid.NewGuid()).DeletePost(post.Id));
            postService.Verify(s => s.RemovePost(It.IsAny<PostModel>()), Times.Never);
        }

        [Fact]
        public async Task DeletePost_ThrowsNotFound_WhenPostMissing()
        {
            var postService = new Mock<IPostService>();
            postService.Setup(s => s.GetPostById(It.IsAny<Guid>())).ReturnsAsync((PostModel?)null);

            await Assert.ThrowsAsync<NotFoundException>(() => OwnerController(postService, Guid.NewGuid()).DeletePost(Guid.NewGuid()));
        }

        [Fact]
        public async Task DeletePost_ThrowsGone_WhenAlreadyRemoved()
        {
            var userId = Guid.NewGuid();
            var post = OwnedPost(userId);
            post.IsRemoved = true;
            var postService = new Mock<IPostService>();
            postService.Setup(s => s.GetPostById(post.Id)).ReturnsAsync(post);

            await Assert.ThrowsAsync<GoneException>(() => OwnerController(postService, userId).DeletePost(post.Id));
            postService.Verify(s => s.RemovePost(It.IsAny<PostModel>()), Times.Never);
        }
    }
}
