using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace RepositoryLayer.Models
{
    [Index(nameof(Id))]
    [PrimaryKey(nameof(Id))]
    public class User
    {
        private ImageObj _userIcon;
        private ILazyLoader LazyLoader { get; set;}

        public User(){}

        private User(ILazyLoader lazyLoader)
        {
            LazyLoader = lazyLoader;
        }

        public Guid Id {get; set;}
        public string UserEmail { get; set; } = "";
        public string UserName {get; set;} = "";
        [Required]
        [ForeignKey(nameof(ImageObj))]
        public Guid UserIconId {get; set;}
        [Required]
        public ImageObj UserIcon {get=>LazyLoader.Load(this,ref _userIcon); set=>_userIcon = value;}
        public DateTime CreatedAt{get; set;} = DateTime.Now;
        public ICollection<Comment>? Comments { get; set;} = [];
        public ICollection<Post> Posts {get; set;} = [];
    }
}