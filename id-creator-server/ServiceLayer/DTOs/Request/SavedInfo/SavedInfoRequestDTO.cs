

namespace ServiceLayer.DTOs.Request.SavedInfo
{
    public class SavedInfoRequestDTO<SaveType>
    {
        public Guid id { get; set; }
        public string saveName { get; set; }
        public string saveTime { get; set; }
        public SaveType saveInfo { get; set; }
        public string previewImg { get; set; }
    }

    public class SplashArtTranslationObj
    {
        public double x { get; set; }
        public double y { get; set; }
    }
}