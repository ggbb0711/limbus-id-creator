namespace Server.Util.Enums
{
    public enum SkillType
    {
        OffenseSkill, DefenseSkill, PassiveSkill, CustomEffect, MentalEffect
    }

    public enum PostSortOption
    {
        Newest, Title, MostViewed, MostCommented, Earliest, Latest
    }

    public enum AssetStatus
    {
        Pending, Uploaded, Deleted //Uploaded for backward compatibility and for situation where the url is blank
    }
}