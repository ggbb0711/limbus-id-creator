using Server.Models;

namespace Server.Interface.Repositories
{
    public interface IPostViewRepository : IRepository<PostView>
    {
        int GetViewCount(Guid postId);
    }
}