using Server.Models;

namespace Server.Interface.UtilInterfaces
{
    public interface ISavedPayload
    {
        SavedSkill Skill { get; set; }
        ImageObj SplashArt { get; set; }
        ImageObj SinnerIcon { get; set; }
        Guid SplashArtId { get; set; }
        Guid SinnerIconId { get; set; }
    }
}