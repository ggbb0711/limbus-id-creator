using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Interface.Repositories;
using Server.Util.Obj;

namespace Server.Repositories
{
    public class Repository<T>(ServerDbContext ctx) : IRepository<T> where  T: class
    {
        protected readonly DbSet<T> Set = ctx.Set<T>();

        public async Task<T> AddAsync(T entity)
        {
            await Set.AddAsync(entity);
            return entity;
        }

        public async Task<IEnumerable<T>> AddBulkAsync(IEnumerable<T> entities)
        {
            await Set.AddRangeAsync(entities);
            return entities;
        }

        public  Task<IEnumerable<T>> FindAsync(RepositoryGetParams<T> param)
        {
            IQueryable<T> query = Set;

            if (param.Filter is not null)
            {
                query = query.Where(param.Filter).Skip(param.Skip).Take(param.Take);
            }

            foreach (var includeProperty in param.IncludeProperties.Split
                (new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                query = query.Include(includeProperty);
            }

            if (param.OrderBy != null)
            {
                return Task.FromResult(param.OrderBy(query).AsEnumerable());
            }
            else
            {
                return Task.FromResult(query.AsEnumerable());
            }
        }

        public async Task<T?> GetByIdAsync(Guid id)
        {
            return await ctx.FindAsync<T>(id);
        }

        public Task<T> UpdateAsync(T entity)
        {
            Set.Attach(entity);
            ctx.Entry(entity).State = EntityState.Modified;
            return Task.FromResult(entity);
        }

        public Task<IEnumerable<T>> UpdateBulkAsync(IEnumerable<T> entities)
        {
            Set.AttachRange(entities);
            foreach(var entity in entities)
            {
                ctx.Entry(entity).State = EntityState.Modified;
            }
            return Task.FromResult(entities);
        }

        public Task RemoveAsync(T entity)
        {
            Set.Remove(entity);
            return Task.CompletedTask;
        }

        public Task SaveChangeAsync()
        {
            return ctx.SaveChangesAsync();
        }
    }
}