using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace RepositoryLayer.Models
{
    [PrimaryKey(nameof(Id))]
    public class Post
    {
        private ICollection<ImageObj> _imageAttaches = new List<ImageObj>();
        private ICollection<Tag> _tags = new List<Tag>();
        public User _user;
        private ILazyLoader LazyLoader { get; set; }

        public Post() { }

        private Post(ILazyLoader lazyLoader)
        {
            LazyLoader = lazyLoader;
        }

        public Guid Id { get; set; }
        public string Title { get; set; } = "";
        public string Description { get; set; } = "";
        public DateTime Created { get; set; } = DateTime.Now;

        public virtual ICollection<ImageObj> ImageAttaches
        {
            get => LazyLoader.Load(this, ref _imageAttaches) ?? new List<ImageObj>();
            set => _imageAttaches = value;
        }

        public ICollection<Comment> Comments {get; set;} =[];
        public int ViewCount { get; set; } = 0;
        
        [ForeignKey(nameof(User))]
        public Guid UserId { get; set; }
        public virtual User User
        {
            get => LazyLoader.Load(this, ref _user);
            set => _user = value;
        }

        public virtual ICollection<Tag> Tags
        {
            get => LazyLoader.Load(this, ref _tags) ?? new List<Tag>();
            set => _tags = value;
        }
    }
}