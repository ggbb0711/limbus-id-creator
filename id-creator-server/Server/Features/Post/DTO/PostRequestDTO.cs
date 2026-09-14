
using FluentValidation;
using Server.Features.Images;

namespace Server.Features.Post.DTO
{
    public class PostRequestDTO
    {
        public string Title { get; set; } = "";
        public string Description { get; set; } = "";
        public List<string> ImagesAttach { get; set; } = [];
        public List<string> Tags { get; set; } = [];
    }

    public class PostRequestDTOValidator : AbstractValidator<PostRequestDTO>
    {
        public PostRequestDTOValidator()
        {
            RuleFor(p=>p.Title)
                .MaximumLength(199)
                .NotEmpty()
                .WithErrorCode("Title is required and must be < 200 characters long");
            
            RuleFor(p=>p.ImagesAttach)
                .Must(images => images.Count >= 1 && images.Count <= 8)
                .WithMessage("Post must have between 1 and 8 images");

            RuleFor(p=>p.Tags)
                .Must(tags => tags.Count < 22)
                .WithMessage("Post cannot have more than 22 tags");
            
            RuleForEach(p=>p.Tags)
                .MustAsync( async (tag, _) => 
                {
                    return await FileHelper.CheckUrlSize(tag, 7000000);
                })
                .WithMessage("Post images must be <= 7mb");
        }
    }
}