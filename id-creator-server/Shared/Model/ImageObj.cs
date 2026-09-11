using Microsoft.EntityFrameworkCore;
using Server.Features.Images.Enum;

namespace Server.Shared.Model
{
    [Owned]
    [PrimaryKey(nameof(Id))]
    public class ImageObj
    {
        public Guid Id { get; set; }
        public string Url { get; set; } = "";
        public AssetStatus Status { get; set; } = AssetStatus.Uploaded;
        public DateTime LastUpdated { get; set; } = DateTime.Now;
    }
}
