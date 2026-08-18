

namespace Server.Util.Obj
{
    public class SearchSaveParams
    {
        public string searchName { get; init; }
        public Guid userId { get; init; }
        public int page { get; init; } = 0;
        public int limit { get; init; } = 10;
    }
}