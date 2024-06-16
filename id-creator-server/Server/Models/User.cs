using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Server.Models
{
    [Index(nameof(Id))]
    [PrimaryKey(nameof(Id))]
    public class User
    {
        public Guid Id {get; set;}
        public string UserEmail { get; set; } = "";
        public string UserName {get; set;} = "";
        [ForeignKey(nameof(ImageObj))]
        public Guid? UserIconId {get; set;}
        public ImageObj? UserIcon {get; set;}
        public DateTime CreatedAt{get; set;}
        public virtual ICollection<Comment>? Comments { get; set;} = [];
    }
}