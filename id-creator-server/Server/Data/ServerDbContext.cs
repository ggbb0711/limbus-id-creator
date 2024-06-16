using System.Collections.ObjectModel;
using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace Server.Data
{
    public class ServerDbContext: DbContext
    {
        public ServerDbContext(DbContextOptions<ServerDbContext> options):base(options)
        {
            AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
        }    
        public DbSet<User> Users { get; set; }
        public DbSet<SavedSkill> SavedSkill { get; set; }
        public DbSet<SavedInfo> SavedInfos { get; set; }
        public DbSet<SavedId> SavedId { get; set; }
        public DbSet<SavedEgo> SavedEgo { get; set; }
        public DbSet<Reaction> Reaction { get; set; }
        public DbSet<PassiveSkill> PassiveSkill { get; set; }
        public DbSet<OffenseSkill> OffenseSkill { get; set; }
        public DbSet<MentalEffect> MentalEffect { get; set; }
        public DbSet<DefenseSkill> DefenseSkill { get; set; }
        public DbSet<CustomEffect> CustomEffect { get; set; }
        public DbSet<Comment> Comment { get; set; }
        public DbSet<Tag> Tag { get; set; }
        public DbSet<Session> Session { get; set; }
        public DbSet<ImageObj> ImageObjs { get; set; }
        public DbSet<UploadingImage> UploadingImages { get; set; }
    }

}