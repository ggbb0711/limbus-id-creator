
using Server.Features.Post.Enum;

namespace Server.Features.Post.Repository
{
    public class SearchPostOption
    {
        public string Title { get; set; } = "";
        public List<string> Tag { get; set; } = [];
        public Guid UserId { get; set; }
        public bool IncludeComment { get; set; } =false;
        public PostSortOption SortedBy { get; set; } = PostSortOption.Latest;
        public int page { get; set; } = 0;
        public int limit { get; set; } = 10;
    }
}
