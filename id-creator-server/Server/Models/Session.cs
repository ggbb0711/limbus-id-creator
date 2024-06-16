

using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Server.Models
{
    [PrimaryKey(nameof(Id))]
    public class Session
    {
        public Guid Id { get; set; }
        public DateTime Created { get; set; }
        public DateTime Expired { get; set; }
        [ForeignKey(nameof(User))]
        public Guid UserId { get; set; }
        public virtual User User { get; set; }
    }
}