

namespace Server.Util.Obj
{
    public class SearchSaveParams
    {
        public string Name { get; init; }
        public Guid UserId { get; init; }
        public int Page { get; init; } = 0;
        public int Limit { get; init; } = 10;
    }
}