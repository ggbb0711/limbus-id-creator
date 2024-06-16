

using Microsoft.EntityFrameworkCore;

namespace Server.Models
{
    [PrimaryKey(nameof(TagName))]
    public class Tag
    {
        public string TagName { get; set; } = "";
    }
}