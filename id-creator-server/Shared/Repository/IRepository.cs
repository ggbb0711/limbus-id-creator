using System.Linq.Expressions;
using Server.Shared.Http;

namespace Server.Shared.Repository
{
    public interface IRepository<T>  where T : class
    {
        Task<T?> GetByIdAsync(Guid id);
        Task<T> AddAsync(T entity);
        Task<IEnumerable<T>> AddBulkAsync(IEnumerable<T> entities);
        Task<T> UpdateAsync(T entity);
        Task<IEnumerable<T>> UpdateBulkAsync(IEnumerable<T> entities);
        Task RemoveAsync(T entity);
        Task<IEnumerable<T>> FindAsync(RepositoryGetParams<T> param);
        Task SaveChangeAsync();

    }

}
