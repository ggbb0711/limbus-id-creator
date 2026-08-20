namespace Server.DTOs.Requests.SavedInfo
{
    public class SkillImageEntry
    {
        public required IFormFile Image { get; set; }
        public required int Index { get; set; }
    }

    public class SaveInfoFilesRequestDTO
    {
        public List<SkillImageEntry> SkillImages { get; set; } = [];
        public IFormFile? ThumbnailImage { get; set; }
        public IFormFile? SplashArtImg { get; set; }
        public IFormFile? SinnerIcon { get; set; }
    }
}