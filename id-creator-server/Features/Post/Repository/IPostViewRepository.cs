using Server.Shared.Model;
using Server.Shared.Repository;

namespace Server.Features.Post.Repository
{
    public interface IPostViewRepository : IRepository<PostView>
    {
        int GetViewCount(Guid postId);
    }
}
