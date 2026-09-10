using FluentValidation;

namespace Server.DTOs.Request.User
{
    public class UpdateUserProfileDTO
    {
        public string UserName {get; set;} = "";
        public IFormFile? UserIconFile {get; set;}
    }
    public class UpdateUserProfileDTOValidator : AbstractValidator<UpdateUserProfileDTO>
    {
        public UpdateUserProfileDTOValidator()
        {
            RuleFor(u => u.UserName)
                .NotEmpty()
                .WithMessage("Username must not be empty")
                .MaximumLength(65)
                .WithMessage("Username must be between 1 and 65 characters long");
        
            RuleFor(u => u.UserIconFile)
                .Must(file=> file == null || file.Length <= 100 * 1024)
                .WithMessage("User icon must be <= 100kb");
        }
    }
}