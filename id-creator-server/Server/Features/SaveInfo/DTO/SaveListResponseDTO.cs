namespace Server.Features.SaveInfo.DTO
{
    public class SaveListResponseDTO<SaveType>
    {
        public List<SaveInfoResponseDTO<SaveType>> List { get; set; } = [];
        public int Total { get; set; } = 0;
    }
}
