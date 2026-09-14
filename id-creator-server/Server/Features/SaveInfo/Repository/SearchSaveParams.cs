

namespace Server.Features.SaveInfo.Repository
{
    public class SearchSaveParams
    {
        public string Name { get; init; } = "";
        public Guid UserId { get; init; }
        public int Page { get; init; } = 0;
        public int Limit { get; init; } = 10;
    }
}
