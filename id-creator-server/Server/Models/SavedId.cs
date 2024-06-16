

using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Server.Interface;

namespace Server.Models
{
    [PrimaryKey(nameof(Id))]
    public class SavedId
    {
        [ForeignKey(nameof(SavedSkill))]
        public Guid Id { get; set; }
        public string Title { get; set; } = "";
        public string Name { get; set; }="";
        [ForeignKey(nameof(ImageObj))]
        public Guid SplashArtKey { get; set; }
        public ImageObj? SplashArt { get; set; }
        public double SplashArtScale{ get; set; }
        public int SplashArtTranslationX { get; set; } = 0;
        public int SplashArtTranslationY { get; set; } = 0;
        public int HP{ get; set; }
        public int MinSpeed { get; set; }
        public int MaxSpeed { get; set; }
        public string StaggerResist{ get; set; }="";
        public int DefenseLevel { get; set; }
        public string SinnerColor { get; set; }="";
        [ForeignKey(nameof(ImageObj))]
        public Guid SinnerIconKey { get; set; }
        public ImageObj? SinnerIcon { get; set; }
        public int SlashResistant { get; set; }
        public int PierceResistant {get; set; }
        public int BluntResistant { get; set; }
        public string Rarity {get; set;} ="";
        [ForeignKey(nameof(SavedSkill))]
        public Guid SavedSkillId { get; set; }
        public SavedSkill? Skill { get; set; } = null;
    }
}