using System.ComponentModel.DataAnnotations;

namespace Server.Features.SaveInfo.DTO
{
    public class SavedInfoRequestDTO<SaveType>
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = "";
        public DateTime SaveTime { get; set; }
        [Required(ErrorMessage = "SaveInfo is required.")]
        public required SaveType SaveInfo { get; set; }
        public string PreviewImg { get; set; } = "";
    }

    public class SplashArtTranslationObj
    {
        public double X { get; set; }
        public double Y { get; set; }
    }
}