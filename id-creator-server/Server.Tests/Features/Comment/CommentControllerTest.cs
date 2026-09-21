using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Server.Features.Comment;
using Server.Features.Comment.DTO;
using Server.Features.Comment.Repository;
using Server.Features.Comment.Service;
using Server.Shared.Exception;
using Server.Shared.Http;
using CommentModel = Server.Shared.Model.Comment;

namespace Server.Tests.Features.Comment
{
    public class CommentControllerTest
    {
        private static CommentController CreateController(
            Mock<ICommentService> commentService, Mock<IMapper> mapper, Guid? userId = null)
        {
            var identity = userId.HasValue
                ? new ClaimsIdentity([new Claim(JwtRegisteredClaimNames.Sub, userId.Value.ToString())])
                : new ClaimsIdentity();

            return new CommentController(commentService.Object, mapper.Object)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal(identity) },
                },
            };
        }

        [Fact]
        public async Task CreateComment_MapsAndCreatesComment_WhenAuthenticated()
        {
            var userId = Guid.NewGuid();
            var dto = new CommentRequestDTO { Content = "Nice build" };
            var mappedComment = new CommentModel();
            var createdComment = new CommentModel { Id = Guid.NewGuid() };
            var responseDto = new CommentResponseDTO { Content = "Nice build" };

            var commentService = new Mock<ICommentService>();
            var mapper = new Mock<IMapper>();
            mapper.Setup(m => m.Map<CommentModel>(dto)).Returns(mappedComment);
            commentService.Setup(s => s.CreateComment(mappedComment)).ReturnsAsync(createdComment);
            mapper.Setup(m => m.Map<CommentResponseDTO>(createdComment)).Returns(responseDto);

            var controller = CreateController(commentService, mapper, userId);

            var result = await controller.CreateComment(dto);

            Assert.Equal(userId, mappedComment.UserId);
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equivalent(ApiResponse<CommentResponseDTO>.Ok(responseDto, "Comment created successfully."), okResult.Value);
            commentService.Verify(s => s.CreateComment(mappedComment), Times.Once);
        }

        [Fact]
        public async Task CreateComment_ThrowsUnauthorizedException_WhenSubClaimMissing()
        {
            var dto = new CommentRequestDTO { Content = "Nice build" };
            var commentService = new Mock<ICommentService>();
            var mapper = new Mock<IMapper>();

            var controller = CreateController(commentService, mapper, userId: null);

            await Assert.ThrowsAsync<UnauthorizedException>(() => controller.CreateComment(dto));

            commentService.Verify(s => s.CreateComment(It.IsAny<CommentModel>()), Times.Never);
        }

        [Fact]
        public async Task GetComments_ReturnsMappedComments_WhenFound()
        {
            var postId = Guid.NewGuid();
            var comment1 = new CommentModel { Id = Guid.NewGuid(), PostId = postId };
            var comment2 = new CommentModel { Id = Guid.NewGuid(), PostId = postId };
            var dto1 = new CommentResponseDTO { PostId = postId };
            var dto2 = new CommentResponseDTO { PostId = postId };

            var commentService = new Mock<ICommentService>();
            var mapper = new Mock<IMapper>();
            commentService
                .Setup(s => s.FindComments(It.Is<SearchCommentOption>(o => o.PostId == postId)))
                .ReturnsAsync([comment1, comment2]);
            mapper.Setup(m => m.Map<CommentResponseDTO>(comment1)).Returns(dto1);
            mapper.Setup(m => m.Map<CommentResponseDTO>(comment2)).Returns(dto2);

            var controller = CreateController(commentService, mapper);

            var result = await controller.GetComments(postId);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var response = Assert.IsType<ApiResponse<List<CommentResponseDTO>>>(okResult.Value);
            Assert.Equal([dto1, dto2], response.Data);
            mapper.Verify(m => m.Map<CommentResponseDTO>(It.IsAny<CommentModel>()), Times.Exactly(2));
        }

        [Fact]
        public async Task GetComments_ReturnsEmptyArray_WhenNoneMatch()
        {
            var postId = Guid.NewGuid();
            var commentService = new Mock<ICommentService>();
            var mapper = new Mock<IMapper>();
            commentService
                .Setup(s => s.FindComments(It.Is<SearchCommentOption>(o => o.PostId == postId)))
                .ReturnsAsync([]);

            var controller = CreateController(commentService, mapper);

            var result = await controller.GetComments(postId);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var response = Assert.IsType<ApiResponse<List<CommentResponseDTO>>>(okResult.Value);
            Assert.Empty(response.Data!);
            mapper.Verify(m => m.Map<CommentResponseDTO>(It.IsAny<CommentModel>()), Times.Never);
        }

        [Fact]
        public async Task GetComments_UsesDefaultPageAndLimit_WhenOmitted()
        {
            var postId = Guid.NewGuid();
            var commentService = new Mock<ICommentService>();
            var mapper = new Mock<IMapper>();
            commentService
                .Setup(s => s.FindComments(It.IsAny<SearchCommentOption>()))
                .ReturnsAsync([]);

            var controller = CreateController(commentService, mapper);

            await controller.GetComments(postId);

            commentService.Verify(
                s => s.FindComments(It.Is<SearchCommentOption>(o => o.PostId == postId && o.Page == 0 && o.Limit == 10)),
                Times.Once);
        }
    }
}
