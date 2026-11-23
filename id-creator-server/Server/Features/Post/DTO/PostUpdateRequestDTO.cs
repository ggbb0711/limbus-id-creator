using FluentValidation;
using Server.Shared.Model;

namespace Server.Features.Post.DTO
{
    public class PostUpdateRequestDTO
    {
        public string Description { get; set; } = "";
        public List<PostCardUpdateDTO> Cards { get; set; } = [];
        public List<string> Tags { get; set; } = [];
    }

    public class PostCardUpdateDTO
    {
        public Guid? CardId { get; set; }
        public Guid? SaveId { get; set; }
        public PostCardKind? Kind { get; set; }
    }

    public class PostUpdateRequestDTOValidator : AbstractValidator<PostUpdateRequestDTO>
    {
        public const string CardSourceMessage = "Each image must keep an existing card or come from a cloud save";

        public PostUpdateRequestDTOValidator()
        {
            RuleFor(p => p.Cards)
                .Must(cards => cards.Count >= 1 && cards.Count <= 8)
                .WithMessage("Post must have between 1 and 8 images");

            RuleFor(p => p.Cards)
                .Must(cards => cards.Where(c => c.CardId != null).GroupBy(c => c.CardId).All(g => g.Count() == 1))
                .WithMessage("Each image can only appear once");

            RuleForEach(p => p.Cards).ChildRules(card =>
            {
                card.RuleFor(c => c)
                    .Must(c => c.CardId != null
                        ? c.CardId != Guid.Empty && c.SaveId == null && c.Kind == null
                        : c.SaveId != null && c.SaveId != Guid.Empty)
                    .WithMessage(CardSourceMessage);
                card.RuleFor(c => c.Kind)
                    .NotNull()
                    .IsInEnum()
                    .When(c => c.CardId == null)
                    .WithMessage("Each image must be an Identity or an Ego");
            });

            RuleFor(p => p.Tags)
                .Must(tags => tags.Count < 22)
                .WithMessage("Post cannot have more than 22 tags");
        }
    }
}
