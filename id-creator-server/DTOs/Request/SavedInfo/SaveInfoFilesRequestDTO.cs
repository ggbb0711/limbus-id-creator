using FluentValidation;

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

    public class SaveInfoFilesRequestDTOValidator : AbstractValidator<SaveInfoFilesRequestDTO>
    {
        public SaveInfoFilesRequestDTOValidator()
        {
            RuleFor(s=>s.SkillImages)
                .Must(images => images.Count <= 40)
                .WithMessage("A save cannot have more than 40 skill images");
            
            RuleForEach(s=> s.SkillImages)
                .Must(image => image.Image.Length <= 100 * 1024)
                .WithMessage("Skill icon and custom effect icon must be <= 100kb");

            RuleFor(s=>s.ThumbnailImage)
                .Must(thumbnailImage => thumbnailImage==null || thumbnailImage.Length <= 10 * 1024 * 1024)
                .WithMessage("Thumbnai image must be <= 10mb");
            
            RuleFor(s=>s.SplashArtImg)
                .Must(splashArtImage => splashArtImage==null || splashArtImage.Length <= 4 * 1024 * 1024)
                .WithMessage("Thumbnai image must be <= 4mb");
            
            RuleFor(s=>s.SinnerIcon)
                .Must(sinnerIcon => sinnerIcon==null || sinnerIcon.Length <= 100 * 1024)
                .WithMessage("Thumbnai image must be <= 100kb");
        }
    }
}