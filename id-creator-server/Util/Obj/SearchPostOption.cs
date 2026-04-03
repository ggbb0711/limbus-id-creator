
namespace Server.Util.Obj
{
    public class SearchPostOption
    {
        public string Title { get; set; }
        public List<string> Tag { get; set; }
        public string UserId { get; set; }
        public bool IncludeComment { get; set; } =false;
        public string SortedBy { get; set; } = "";
        public int page { get; set; } = 0;
        public int limit { get; set; } = 10;
    }
}