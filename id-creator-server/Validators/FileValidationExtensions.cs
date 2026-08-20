using FluentValidation;

namespace Server.Validators
{
    public static class FileValidationExtensions
    {
        private static readonly byte[][] ImageSignatures =
        [
            [0x89, 0x50, 0x4E, 0x47],
            [0xFF, 0xD8, 0xFF],       
            [0x52, 0x49, 0x46, 0x46], 
        ];

        public static IRuleBuilderOptions<T, IFormFile?> IsValidImage<T>(
            this IRuleBuilder<T, IFormFile?> ruleBuilder, long maxSizeBytes = 5_000_000) =>
            ruleBuilder
                .Must(file => file == null || (file.Length > 0 && file.Length <= maxSizeBytes))
                .WithMessage($"File must be between 1 byte and {maxSizeBytes / 1_000_000}MB")
                .Must(file => file == null || HasImageSignature(file))
                .WithMessage("File is not a recognized image format");

        private static bool HasImageSignature(IFormFile file)
        {
            using var stream = file.OpenReadStream();
            var header = new byte[8];
            var bytesRead = stream.Read(header, 0, header.Length);
            if (stream.CanSeek) stream.Position = 0;

            return bytesRead >= 3 && ImageSignatures.Any(sig =>
                header.Take(sig.Length).SequenceEqual(sig));
        }
    }
}
