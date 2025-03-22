using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace RepositoryLayer.Models
{
    [Index(nameof(Id))]
    [PrimaryKey(nameof(Id))]
    public class SavedEGOInfo
    {
        private ImageObj _imageAttach;
        private User _user;
        private ILazyLoader LazyLoader { get; set; }

        public SavedEGOInfo() { }

        private SavedEGOInfo(ILazyLoader lazyLoader)
        {
            LazyLoader = lazyLoader;
        }

        public Guid Id { get; set; }
        public string Name { get; set; } = "";
        public DateTime SaveTime { get; set; }

        [ForeignKey(nameof(ImageObj))]
        public Guid ImageAttachId { get; set; }

        [Required]
        public virtual ImageObj ImageAttach
        {
            get => LazyLoader.Load(this, ref _imageAttach);
            set => _imageAttach = value;
        }

        [Required]
        [ForeignKey(nameof(User))]
        public Guid UserId { get; set; }

        public virtual User User
        {
            get => LazyLoader.Load(this, ref _user);
            set => _user = value;
        }
        [ForeignKey(nameof(SavedEgo))]
        public Guid SavedEgoKey { get; set;}
        public SavedEgo SavedEgo { get; set; }
    }
}