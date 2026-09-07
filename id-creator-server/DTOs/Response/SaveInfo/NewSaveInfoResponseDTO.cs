

namespace Server.DTOs.Response.SaveInfo
{
    public class SaveInfoResponseDTO<SaveType>
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = "";
        public DateTime SaveTime { get; set; }
        public required SaveType SaveInfo { get; set; }
        public string PreviewImg { get; set; } = "";
    }

    // public class SaveInfoResponseDTOUser
    // {
    //     public Guid id { get; set; }
    //     public string email { get; set; }
    //     public string name { get; set; }
    //     public string userIcon { get; set; }
    // }
}