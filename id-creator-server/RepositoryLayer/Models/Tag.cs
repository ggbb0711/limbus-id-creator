using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace RepositoryLayer.Models
{
    [PrimaryKey(nameof(Id))]
    public class Tag
    {
        private Post _posts;
        private ILazyLoader LazyLoader { get; set; }

        public Tag() { }

        private Tag(ILazyLoader lazyLoader)
        {
            LazyLoader = lazyLoader;
        }
        public Guid Id { get; set; } = Guid.NewGuid();
        public string TagName { get; set; } = "";

        public virtual Post Posts
        {
            get => LazyLoader.Load(this, ref _posts);
            set => _posts = value;
        }

        [ForeignKey(nameof(Post))]
        public Guid PostId { get; set; }
    }
}