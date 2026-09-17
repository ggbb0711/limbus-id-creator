using Moq;
using Server.Features.Post.Repository;
using Server.Features.Post.Service;
using Server.Shared.Model;

namespace Server.Tests.Features.Post.Service
{
    public class PostViewServiceTest
    {
        [Fact]
        public void GetViewCount_ReturnsRepositoryResult()
        {
            var postId = Guid.NewGuid();
            var repository = new Mock<IPostViewRepository>();
            repository.Setup(r => r.GetViewCount(postId)).Returns(42);

            var service = new PostViewService(repository.Object);
            var result = service.GetViewCount(postId);

            Assert.Equal(42, result);
        }

        [Fact]
        public async Task LogView_PersistsView_AndReturnsUpdatedViewCount()
        {
            var view = new PostView { Id = Guid.NewGuid(), PostId = Guid.NewGuid(), UserId = Guid.NewGuid() };
            var repository = new Mock<IPostViewRepository>();
            repository.Setup(r => r.AddAsync(view)).ReturnsAsync(view);
            repository.Setup(r => r.SaveChangeAsync()).Returns(Task.CompletedTask);
            repository.Setup(r => r.GetViewCount(view.PostId)).Returns(9);

            var service = new PostViewService(repository.Object);
            var result = await service.LogView(view);

            Assert.Equal(9, result);
            repository.Verify(r => r.AddAsync(view), Times.Once);
            repository.Verify(r => r.SaveChangeAsync(), Times.Once);
            repository.Verify(r => r.GetViewCount(view.PostId), Times.Once);
        }
    }
}
