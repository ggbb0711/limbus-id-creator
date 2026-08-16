

namespace Server.Util.Obj
{
    public class SearchSaveParams
    {
        public string searchName { get; set; }
        public Guid userId { get; set; }
        public int page { get; set; } = 0;
        public int limit { get; set; } = 10;
    }
}