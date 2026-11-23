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

    public static class CardStyleRules
    {
        public const int MinWidth = 900;
        public const int MaxWidth = 3200;
        public const int MinHeight = 700;
        public const int MaxHeight = 3000;
        public const string LayoutMessage = "Card layout must be Horizontal or Vertical";
        public static readonly string WidthMessage = $"Card width must be between {MinWidth} and {MaxWidth}";
        public static readonly string HeightMessage = $"Card height must be between {MinHeight} and {MaxHeight}";
    }

    public class SplashArtTranslationObj
    {
        public double X { get; set; }
        public double Y { get; set; }
    }
}