using Server.Models;

namespace Server.Interface.UtilInterfaces
{
    public interface ISavedEntry<TSaved> where TSaved : ISavedPayload
    {
        Guid Id { get; set; }
        string Name { get; set; }
        ImageObj ImageAttach { get; set; }
        DateTime SaveTime { get; set; }
        Guid UserId { get; set; }
        TSaved Saved { get; set; }
    }
}