
using Microsoft.EntityFrameworkCore;

namespace Server.Models
{
    [PrimaryKey(nameof(Id))]
    public class ImageObj
    {
        public Guid Id { get; set; }
        public string Url { get; set; } = "";
    }
}