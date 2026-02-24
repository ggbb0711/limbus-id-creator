using Server.Interface.Repositories;
using Server.Interface.ServiceInterface.ImageObjService;
using Server.Models;

namespace Server.Services.ImageObjService
{
    public class ImageObjService(IImageObjRepository imageObjRepository) : IImageObjService
    {
        private readonly IImageObjRepository _imageObjRepository = imageObjRepository;

        public async Task<ImageObj?> UpdateImage(Guid Id, string newUrl, DateTime lastUpdated)
        {
            var foundImage = await _imageObjRepository.GetImageObj(Id);
            if (foundImage != null && !lastUpdated.ToString().Equals(foundImage.LastUpdated.ToString())) return null;
            return await _imageObjRepository.UpdateImage(Id, newUrl);
        }
    }
}