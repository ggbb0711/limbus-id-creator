using Microsoft.EntityFrameworkCore;

namespace Server.Models
{
    [Owned]
    [PrimaryKey(nameof(Id))]
    public class ImageObj
    {
        public Guid Id { get; set; }
        public string Url { get; set; } = "";
        public DateTime LastUpdated { get; set; } = DateTime.Now;
    }
}