

using Server.Shared.Repository;

namespace Server.Features.Post.Repository
{
    public interface IPostRepository : IRepository<PostModel>
    {
        int GetPostCount(SearchPostOption option);
    }
}
