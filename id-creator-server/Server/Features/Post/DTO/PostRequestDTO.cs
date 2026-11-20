using FluentValidation;

namespace Server.Features.Post.DTO
{
    public class PostRequestDTO
    {
        public string Title { get; set; } = "";
        public string Description { get; set; } = "";
        public List<PostCardRequestDTO> Cards { get; set; } = [];
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

            RuleFor(p=>p.Cards)
                .Must(cards => cards.Count >= 1 && cards.Count <= 8)
                .WithMessage("Post must have between 1 and 8 images");

            RuleForEach(p=>p.Cards).ChildRules(card =>
            {
                card.RuleFor(c=>c.SaveId).NotEmpty().WithMessage("Each image must come from a cloud save");
                card.RuleFor(c=>c.Kind).IsInEnum().WithMessage("Each image must be an Identity or an Ego");
            });

            RuleFor(p=>p.Tags)
                .Must(tags => tags.Count < 22)
                .WithMessage("Post cannot have more than 22 tags");
        }
    }
}
