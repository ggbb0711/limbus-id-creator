

using Server.Models;

namespace Server.Interface.ServiceInterface.ImageObjService
{
    public interface IImageObjService
    {
        public Task<ImageObj?> UpdateImage(Guid Id, string newUrl, DateTime lastUpdated);
    }
}