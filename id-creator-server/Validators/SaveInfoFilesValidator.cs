using FluentValidation;
using Server.Util.Obj;

namespace Server.Validators
{
    public class SaveInfoFilesValidator : AbstractValidator<SaveInfoFiles>
    {
        public SaveInfoFilesValidator()
        {
            RuleFor(f => f.skillImages)
                .Must(s => s.Count <= 40)
                .WithMessage("Can only upload up to 40 skill images and custom effect icons");

            RuleFor(f => f)
                .Must(f => f.imageIndex.Length == f.skillImages.Count)
                .WithMessage("Image index and skill images must have the same length");

            RuleForEach(f => f.skillImages).IsValidImage();
            RuleFor(f => f.thumbnailImage).IsValidImage();
            RuleFor(f => f.splashArtImg).IsValidImage();
            RuleFor(f => f.sinnerIcon).IsValidImage();
        }
    }
}
