

namespace Server.Util.Obj
{
    public class SearchSaveParams
    {
        public string searchName { get; set; }
        public string[] searchTags { get; set; }
        public string userId { get; set; }
        public string searchType { get; set; }
        public bool IsPublic { get; set; }
    }
}