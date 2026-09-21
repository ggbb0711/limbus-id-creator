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

namespace Server.Tests.Features.Post
{
    public class PostControllerTest
    {
        private static PostController CreateController(
            Mock<IPostService> postService, Mock<IPostViewService> postViewService,
            Mock<ICommentService> commentService, Mock<IMapper> mapper, Guid? userId = null)
        {
            var identity = userId.HasValue
                ? new ClaimsIdentity([new Claim(JwtRegisteredClaimNames.Sub, userId.Value.ToString())])
                : new ClaimsIdentity();

            return new PostController(postService.Object, postViewService.Object, commentService.Object, mapper.Object)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal(identity) },
                },
            };
        }

        [Fact]
        public async Task CreateNewPost_MapsAndCreatesPost_WhenAuthenticated()
        {
            var userId = Guid.NewGuid();
            var dto = new PostRequestDTO { Title = "New Post" };
            var mappedPost = new PostModel();
            var addedPost = new PostModel { Id = Guid.NewGuid() };
            var responseDto = new PostResponseDTO { Id = addedPost.Id };

            var postService = new Mock<IPostService>();
            var postViewService = new Mock<IPostViewService>();
            var commentService = new Mock<ICommentService>();
            var mapper = new Mock<IMapper>();
            mapper.Setup(m => m.Map<PostModel>(dto)).Returns(mappedPost);
            postService.Setup(s => s.CreatePost(mappedPost)).ReturnsAsync(addedPost);
            mapper.Setup(m => m.Map<PostResponseDTO>(addedPost)).Returns(responseDto);

            var controller = CreateController(postService, postViewService, commentService, mapper, userId);

            var result = await controller.CreateNewPost(dto);

            Assert.Equal(userId, mappedPost.UserId);
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equivalent(ApiResponse<PostResponseDTO>.Ok(responseDto, "Post created successfully"), okResult.Value);
            postService.Verify(s => s.CreatePost(mappedPost), Times.Once);
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

            var controller = CreateController(postService, postViewService, commentService, mapper);

            var result = await controller.GetPosts(option);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var response = Assert.IsType<ApiResponse<PostListResponseDTO>>(okResult.Value);
            Assert.Empty(response.Data!.List);
            Assert.Equal(5, response.Data.Total);
        }

        [Fact]
        public async Task GetPosts_PopulatesViewAndCommentCounts_ForEachPost()
        {
            var option = new SearchPostOption();
            var post1 = new PostModel { Id = Guid.NewGuid() };
            var post2 = new PostModel { Id = Guid.NewGuid() };
            var dto1 = new PostResponseDTO { Id = post1.Id };
            var dto2 = new PostResponseDTO { Id = post2.Id };

            var postService = new Mock<IPostService>();
            var postViewService = new Mock<IPostViewService>();
            var commentService = new Mock<ICommentService>();
            var mapper = new Mock<IMapper>();
            postService.Setup(s => s.FindPosts(option)).ReturnsAsync([post1, post2]);
            postService.Setup(s => s.GetPostCount(option)).Returns(2);
            mapper.Setup(m => m.Map<PostResponseDTO>(post1)).Returns(dto1);
            mapper.Setup(m => m.Map<PostResponseDTO>(post2)).Returns(dto2);
            postViewService.Setup(s => s.GetViewCount(post1.Id)).Returns(10);
            postViewService.Setup(s => s.GetViewCount(post2.Id)).Returns(20);
            commentService.Setup(s => s.GetCommentCount(post1.Id)).Returns(3);
            commentService.Setup(s => s.GetCommentCount(post2.Id)).Returns(4);

            var controller = CreateController(postService, postViewService, commentService, mapper);

            var result = await controller.GetPosts(option);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var response = Assert.IsType<ApiResponse<PostListResponseDTO>>(okResult.Value);
            Assert.Equal(2, response.Data!.Total);
            var first = Assert.Single(response.Data.List, p => p.Id == post1.Id);
            Assert.Equal(10, first.ViewCount);
            Assert.Equal(3, first.CommentCount);
            var second = Assert.Single(response.Data.List, p => p.Id == post2.Id);
            Assert.Equal(20, second.ViewCount);
            Assert.Equal(4, second.CommentCount);
        }
    }
}
