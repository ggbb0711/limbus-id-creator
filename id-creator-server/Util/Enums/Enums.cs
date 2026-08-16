using System.Text.Json.Serialization;
using Newtonsoft.Json.Converters;

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
}