using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace RepositoryLayer.Models
{
    [PrimaryKey(nameof(Id))]
    public class SavedEgo 
    {
        private ImageObj _splashArt;
        private ImageObj _sinnerIcon;
        private SavedSkill _skill;
        private ILazyLoader LazyLoader { get; set; }

        public SavedEgo() { }

        private SavedEgo(ILazyLoader lazyLoader)
        {
            LazyLoader = lazyLoader;
        }

        [ForeignKey(nameof(SavedEGOInfo))]
        public Guid Id { get; set; }
        public string Title { get; set; } = "";
        public string Name { get; set; } = "";
        public double SanityCost { get; set; } = 0;

        [Required]
        [ForeignKey(nameof(ImageObj))]
        public Guid SplashArtId { get; set; }

        [Required]
        public virtual ImageObj SplashArt
        {
            get => LazyLoader.Load(this, ref _splashArt);
            set => _splashArt = value;
        }

        public double SplashArtScale { get; set; } = 0;
        public double SplashArtTranslationX { get; set; } = 0;
        public double SplashArtTranslationY { get; set; } = 0;
        public double SinResistantWrath { get; set; } = 0;
        public double SinResistantLust { get; set; } = 0;
        public double SinResistantSloth { get; set; } = 0;
        public double SinResistantGluttony { get; set; } = 0;
        public double SinResistantGloom { get; set; } = 0;
        public double SinResistantPride { get; set; } = 0;
        public double SinResistantEnvy { get; set; } = 0;
        public double SinCostWrath { get; set; } = 0;
        public double SinCostLust { get; set; } = 0;
        public double SinCostSloth { get; set; } = 0;
        public double SinCostGluttony { get; set; } = 0;
        public double SinCostGloom { get; set; } = 0;
        public double SinCostPride { get; set; } = 0;
        public double SinCostEnvy { get; set; } = 0;
        public string SinnerColor { get; set; } = "";

        [Required]
        [ForeignKey(nameof(ImageObj))]
        public Guid SinnerIconId { get; set; }

        [Required]
        public virtual ImageObj SinnerIcon
        {
            get => LazyLoader.Load(this, ref _sinnerIcon);
            set => _sinnerIcon = value;
        }

        public string EgoLevel { get; set; } = "";

        [Required]
        [ForeignKey(nameof(SavedSkill))]
        public Guid SavedSkillId { get; set; }

        public virtual SavedSkill Skill
        {
            get => LazyLoader.Load(this, ref _skill);
            set => _skill = value;
        }
    }
}