
using Server.Util.Enums;

namespace Server.Util.Obj
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