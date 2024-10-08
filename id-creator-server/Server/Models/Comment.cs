


using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace Server.Models
{
    [PrimaryKey(nameof(Id))]
    public class Comment
    {
        private User _user;
        private ILazyLoader LazyLoader { get; set; }

        public Comment() { }

        private Comment(ILazyLoader lazyLoader)
        {
            LazyLoader = lazyLoader;
        }
        public Guid Id { get; set; }
        public string Content { get; set; } ="";
        public DateTime Created { get; set; } = DateTime.Now;
        [ForeignKey(nameof(Post))]
        public Guid PostId { get; set; }
        [ForeignKey(nameof(User))]
        public Guid UserId { get; set; }
        public virtual User User
        {
            get => LazyLoader.Load(this, ref _user);
            set => _user = value;
        }
    }
}