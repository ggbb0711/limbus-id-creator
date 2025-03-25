using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace RepositoryLayer.Models
{
    [PrimaryKey(nameof(Id))]
    public class Comment
    {
        private User _user;
        
        public Guid Id { get; set; }
        public string Content { get; set; } = String.Empty;
        public DateTime Created { get; set; } = DateTime.Now;
        [ForeignKey(nameof(Post))]
        public Guid PostId { get; set; }
        [ForeignKey(nameof(User))]
        public Guid UserId { get; set; }
        
        private ILazyLoader LazyLoader { get; set; }
        
        private Comment() { }

        private Comment(ILazyLoader lazyLoader)
        {
            LazyLoader = lazyLoader;
        }
        public virtual User User
        {
            get => LazyLoader.Load(this, ref _user);
            set => _user = value;
        }
    }
}