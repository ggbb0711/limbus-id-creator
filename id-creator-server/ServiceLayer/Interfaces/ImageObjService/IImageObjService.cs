

using RepositoryLayer.Models;

namespace ServiceLayer.Interfaces.ImageObjService
{
    public interface IImageObjService
    {
        public Task<ImageObj?> UpdateImage(Guid Id, string newUrl, DateTime lastUpdated);
    }
}