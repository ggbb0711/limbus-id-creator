using Server.Interface.Repositories;
using Server.Interface.ServiceInterface.ImageObjService;
using Server.Models;
using Server.Util.Enums;

namespace Server.Services.ImageObjService
{
    public class ImageObjService(IImageObjRepository imageObjRepository) : IImageObjService
    {
        private readonly IImageObjRepository _imageObjRepository = imageObjRepository;


        public Task<List<ImageObj>> GetImagesByStatus(AssetStatus status)
        {
            return _imageObjRepository.GetAllImagesByStatus(status);
        }

        public async Task<ImageObj?> DeleteImage(Guid id)
        {
            var image = await _imageObjRepository.GetByIdAsync(id);
            if(image != null)await _imageObjRepository.RemoveAsync(image);
            return image;
        }

        public async Task<ImageObj?> UpdateImage(Guid Id, string newUrl, DateTime lastUpdated)
        {
            var foundImage = await _imageObjRepository.GetByIdAsync(Id);
            if ((foundImage != null && !lastUpdated.ToString().Equals(foundImage.LastUpdated.ToString()))
                || foundImage == null) return null;
            var separator = newUrl.Contains('?') ? "&" : "?";
            foundImage.Url = $"{newUrl}{separator}v={foundImage.LastUpdated.Ticks}";
            foundImage.LastUpdated = lastUpdated;

            var updatedImage = await _imageObjRepository.UpdateAsync(foundImage);
            await _imageObjRepository.SaveChangeAsync();
            return updatedImage;
        }
    }
}