using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace RepositoryLayer.Models
{
    [Index(nameof(Id))]
    [PrimaryKey(nameof(Id))]
    public class SavedIDInfo
    {
        private ImageObj _imageAttach;
        private User _user;
        private ILazyLoader LazyLoader { get; set; }

        public SavedIDInfo() { }

        private SavedIDInfo(ILazyLoader lazyLoader)
        {
            LazyLoader = lazyLoader;
        }

        public Guid Id { get; set; }
        public string Name { get; set; } = "";
        public DateTime SaveTime { get; set; } = DateTime.Now;

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

        [ForeignKey(nameof(SavedId))]
        public Guid SavedIdKey { get; set; }

        public SavedId SavedId { get; set; }
    }
}