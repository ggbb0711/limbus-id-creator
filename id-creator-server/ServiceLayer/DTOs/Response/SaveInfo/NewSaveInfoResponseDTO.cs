

namespace ServiceLayer.DTOs.Response.SaveInfo
{
    public class SaveInfoResponseDTO<SaveType>
    {
        public Guid id { get; set; }
        public string saveName { get; set; }
        public string saveTime { get; set; }
        public SaveType saveInfo { get; set; }
        public string previewImg { get; set; }
    }

    // public class SaveInfoResponseDTOUser
    // {
    //     public Guid id { get; set; }
    //     public string email { get; set; }
    //     public string name { get; set; }
    //     public string userIcon { get; set; }
    // }
}