

namespace Server.Features.SaveInfo.DTO
{
    public class SaveInfoResponseDTO<SaveType>
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = "";
        public DateTime SaveTime { get; set; }
        public required SaveType SaveInfo { get; set; }
        public string PreviewImg { get; set; } = "";
    }
}