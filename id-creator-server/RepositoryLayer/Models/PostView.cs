using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace RepositoryLayer.Models
{
    [PrimaryKey(nameof(Id))]
    public class PostView
    {
        public Guid Id { get; set; }
        [ForeignKey(nameof(Post))]
        public Guid PostId { get; set; }
        [ForeignKey(nameof(User))]
        public Guid? UserId { get; set; }
    }
}