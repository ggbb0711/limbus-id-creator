using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Server.Models
{
    [PrimaryKey(nameof(Id))]
    public class UploadingImage
    {
        [ForeignKey(nameof(ImageObj))]
        public Guid Id { get; set; }
        public byte[]? FileBlob { get; set; } = null;
    }
}