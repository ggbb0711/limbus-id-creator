

using Server.DTOs.Requests.SavedInfo.Skills;

namespace Server.DTOs.Requests.SavedInfo
{
    public class SavedInfoRequestDTO<SaveType>
    {
        public Guid Id { get; set; }
        public string saveName { get; set; }
        public string saveTime { get; set; }
        public SaveType saveInfo { get; set; }
        public string previewImg { get; set; }
        public List<string> tags { get; set; }
    }
}