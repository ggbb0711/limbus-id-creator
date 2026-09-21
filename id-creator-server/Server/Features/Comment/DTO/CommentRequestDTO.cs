using FluentValidation;

namespace Server.Features.Comment.DTO
{
    public class CommentRequestDTO
    {
        public Guid PostId { get; init; } = Guid.NewGuid();
        public string Content { get; init; } = "";
    }

    public class CommentRequestValidator : AbstractValidator<CommentRequestDTO>
    {
        public CommentRequestValidator()
        {
            RuleFor(c => c.Content)
                .NotEmpty()
                .WithMessage("Comment content must not be emptied");
        }
    }
}