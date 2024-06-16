using Server.Models;

namespace Server.Util.Obj
{
    public class UpdateSaveParams
    {
        public string Name { get; set; } ="";
        public DateTime SaveTime { get; set; }
        public string ImageAttach { get; set; } = "";
        public ICollection<Tag> Tags { get; set; } = [];
        public SavedId? SavedId { get; set; }
        public SavedEgo? SavedEgo { get; set; }
    }
}