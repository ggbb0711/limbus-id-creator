

using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Server.Models
{
    [PrimaryKey(nameof(SavedInfoId),nameof(TagName))]
    public class SavedInfo_Tag
    {
        [ForeignKey(nameof(SavedInfo))]
        public Guid SavedInfoId { get; set; }
        public virtual SavedInfo SavedInfo { get; set; }
        [ForeignKey(nameof(Tag))]
        public Guid TagName { get; set; }
        public virtual Tag Tag { get; set; }
    }
}