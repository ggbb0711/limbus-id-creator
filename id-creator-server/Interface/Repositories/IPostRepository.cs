

using Server.Models;
using Server.Util.Obj;

namespace Server.Interface.Repositories
{
    public interface IPostRepository : IRepository<Post>
    {
        int GetPostCount(SearchPostOption option);
    }
}