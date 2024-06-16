


using Microsoft.AspNetCore.Mvc;
using Server.Data;

namespace Server.Controllers
{
    public class IdController(ServerDbContext serverDbContext) : ControllerBase
    {
        private readonly ServerDbContext _serverDbContext = serverDbContext;

        
    }
}