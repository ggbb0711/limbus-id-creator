
namespace Server.Util.Obj
{
    public enum PostSortOption
    {
        Newest, Title, MostViewed, MostCommented, Earliest, Latest
    }
    public class SearchPostOption
    {
        public string Title { get; set; }
        public List<string> Tag { get; set; }
        public Guid UserId { get; set; }
        public bool IncludeComment { get; set; } =false;
        public PostSortOption SortedBy { get; set; } = "";
        public int page { get; set; } = 0;
        public int limit { get; set; } = 10;
    }
}