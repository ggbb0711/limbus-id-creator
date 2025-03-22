using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace RepositoryLayer.Models
{
    [PrimaryKey(nameof(Id))]
    public class SavedId
    {
        private ImageObj _splashArt;
        private ImageObj _sinnerIcon;
        private SavedSkill _skill;
        private ILazyLoader LazyLoader { get; set; }

        public SavedId() { }

        private SavedId(ILazyLoader lazyLoader)
        {
            LazyLoader = lazyLoader;
        }

        [ForeignKey(nameof(SavedIDInfo))]
        public Guid Id { get; set; }
        public string Title { get; set; } = "";
        public string Name { get; set; } = "";
        
        [Required]
        [ForeignKey(nameof(ImageObj))]
        public Guid SplashArtId { get; set; }

        [Required]
        public virtual ImageObj SplashArt
        {
            get => LazyLoader.Load(this, ref _splashArt);
            set => _splashArt = value;
        }

        public double SplashArtScale { get; set; }
        public double SplashArtTranslationX { get; set; } = 0;
        public double SplashArtTranslationY { get; set; } = 0;
        public double HP { get; set; }
        public double MinSpeed { get; set; }
        public double MaxSpeed { get; set; }
        public string StaggerResist { get; set; } = "";
        public double DefenseLevel { get; set; }
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

        public double SlashResistant { get; set; }
        public double PierceResistant { get; set; }
        public double BluntResistant { get; set; }
        public string Rarity { get; set; } = "";

        [Required]
        [ForeignKey(nameof(SavedSkill))]
        public Guid SavedSkillId { get; set; }

        [Required]
        public virtual SavedSkill Skill
        {
            get => LazyLoader.Load(this, ref _skill);
            set => _skill = value;
        }
    }
}