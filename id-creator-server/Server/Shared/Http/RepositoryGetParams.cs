using System.Linq.Expressions;

namespace Server.Shared.Http
{
    public class RepositoryGetParams<T>
    {
        public Expression<Func<T, bool>>? Filter { get; init; }
        public Func<IQueryable<T>, IOrderedQueryable<T>>? OrderBy { get; init;}
        public string IncludeProperties { get; init; } = "";
        public int Skip { get; init; } = 0;
        public int Take { get; init; } = 10;
    }
}
