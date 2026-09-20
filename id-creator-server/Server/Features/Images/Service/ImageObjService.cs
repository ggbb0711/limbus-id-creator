using System.Text.Json;
using Server.Features.Images.Enum;
using Server.Features.Images.Repository;
using Server.Shared.Model;

namespace Server.Features.Images.Service
{
    public class ImageObjService(IImageObjRepository imageObjRepository) : IImageObjService
    {
        private readonly IImageObjRepository _imageObjRepository = imageObjRepository;


        public Task<List<ImageObj>> GetImagesByStatus(AssetStatus status)
        {
            return _imageObjRepository.GetAllImagesByStatus(status);
        }

        public async Task<ImageObj?> DeleteImage(ImageObj image)
        {
            await _imageObjRepository.RemoveAsync(image);
            await _imageObjRepository.SaveChangeAsync();
            return image;
        }

        public async Task<ImageObj?> DeleteImage(Guid id)
        {
            var image = await _imageObjRepository.GetByIdAsync(id);
            if(image != null) await DeleteImage(image);
            return image;
        }

        public async Task<ImageObj?> UpdateImage(ImageObj updateImage)
        {
            var foundImage = await _imageObjRepository.GetByIdAsync(updateImage.Id);
            if ((foundImage != null && !updateImage.LastUpdated.ToString().Equals(foundImage.LastUpdated.ToString()))
                || foundImage == null) return null;
            var separator = updateImage.Url.Contains('?') ? "&" : "?";
            foundImage.Url = $"{updateImage.Url}{separator}v={foundImage.LastUpdated.Ticks}";
            foundImage.LastUpdated = updateImage.LastUpdated;

            var updatedImage = await _imageObjRepository.UpdateAsync(foundImage);
            await _imageObjRepository.SaveChangeAsync();
            return updatedImage;
        }
    }
}
