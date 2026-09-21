using Microsoft.EntityFrameworkCore;
using Server.Shared.Database;

namespace Server.Tests.Features.SaveInfo
{
    public class MockDatabase
    {
        public static ServerDbContext CreateDbConnection()
        {
            var options = new DbContextOptionsBuilder<ServerDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) 
                .Options;

            return new ServerDbContext(options);
        }
    }
}