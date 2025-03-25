using Microsoft.EntityFrameworkCore;

namespace RepositoryLayer.Models
{
    [Owned]
    [PrimaryKey(nameof(Id))]
    public class ImageObj
    {
        public Guid Id { get; set; }
        public string Url { get; set; } = String.Empty;
        public DateTime LastUpdated { get; set; } = DateTime.Now;
    }
}