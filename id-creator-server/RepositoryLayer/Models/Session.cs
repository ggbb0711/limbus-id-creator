using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace RepositoryLayer.Models
{
    [PrimaryKey(nameof(Id))]
    public class Session
    {
        private User _user;
        private ILazyLoader LazyLoader { get; set; }

        public Session() { }

        private Session(ILazyLoader lazyLoader)
        {
            LazyLoader = lazyLoader;
        }

        public Guid Id { get; set; }
        public DateTime Created { get; set; }
        public DateTime Expired { get; set; }

        [ForeignKey(nameof(User))]
        public Guid UserId { get; set; }

        public virtual User User
        {
            get => LazyLoader.Load(this, ref _user);
            set => _user = value;
        }
    }
}