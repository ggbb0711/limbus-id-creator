using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Server.Models
{
    [PrimaryKey(nameof(Id))]
    public class SavedEgo 
    {
        [ForeignKey(nameof(SavedSkill))]
        public Guid Id { get; set; }
        public string Title { get; set; } ="";
        public string Name { get; set; } ="";
        public int SanityCost { get; set; } = 0;
        [ForeignKey(nameof(ImageObj))]
        public Guid SplashArtKey { get; set; }
        public ImageObj? SplashArt { get; set; }
        public int SplashArtScale { get; set; } = 0;
        public int SplashArtTranslationX { get; set; } = 0;
        public int SplashArtTranslationY { get; set; } = 0;
        public int SinResistantWrath { get; set; } = 0;
        public int SinResistantLust { get; set; } = 0;
        public int SinResistantSloth { get; set; } = 0;
        public int SinResistantGluttony { get; set; } = 0;
        public int SinResistantGloom { get; set; } = 0;
        public int SinResistantPride { get; set; } = 0;
        public int SinResistantEnvy { get; set; } = 0;
        public int SinCostWrath { get; set; } = 0;
        public int SinCostLust { get; set; } = 0;
        public int SinCostSloth { get; set; } = 0;
        public int SinCostGluttony { get; set; } = 0;
        public int SinCostGloom { get; set; } = 0;
        public int SinCostPride { get; set; } = 0;
        public int SinCostEnvy { get; set; } = 0;
        public string SinnerColor { get; set; } ="";
        [ForeignKey(nameof(ImageObj))]
        public Guid SinnerIconKey { get; set; }
        public ImageObj? SinnerIcon { get; set; }
        public string EgoLevel { get; set; } ="";
        [ForeignKey(nameof(SavedSkill))]
        public Guid SavedSkillId { get; set; }
        public SavedSkill? Skill { get; set; } = null;
    }
}