using Server.Models;

namespace Server.Util.Obj
{
    public class UpdateSaveParams<SaveType>
    {
        public Guid UpdateId { get; set; }
        public string Name { get; set; } ="";
        public DateTime SaveTime { get; set; }
        public string ImageAttach { get; set; } = "";
        public SaveType Saved { get; set; }
    }
}