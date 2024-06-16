


using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Server.Interface;
using Server.Interface.UtilInterfaces;
using Server.Models;

namespace Server.Models
{
    [Index(nameof(Id))]
    [PrimaryKey(nameof(Id))]
    public class CustomEffect : IImageAttach
    {
        public Guid Id { get; set; }
        public int Index { get; set; }
        [ForeignKey(nameof(SavedSkill))]
        public Guid SavedSkillId { get; set; }
        public string Name { get; set; } = "";
        [ForeignKey(nameof(ImageObj))]
        public Guid ImageAttachKey { get; set; }
        public ImageObj? ImageAttach { get; set; }
        public string EffectColor { get; set; } = "#F1F1F1";
        public string Effect { get; set; } = "";
        public string Type { get; set; } = "CustomEffect";
    }
}