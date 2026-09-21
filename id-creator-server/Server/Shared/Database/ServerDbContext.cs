using Microsoft.EntityFrameworkCore;
using Server.Shared.Model;

namespace Server.Shared.Database
{
    public class ServerDbContext: DbContext
    {
        public ServerDbContext(DbContextOptions<ServerDbContext> options):base(options)
        {
            AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //Configuring cascading delete for the images
            // modelBuilder.Entity<SavedIDInfo>()
            //     .HasOne(s=>s.ImageAttach)
            //     .WithOne()
            //     .HasForeignKey(typeof(ImageObj))
            //     .OnDelete(DeleteBehavior.Cascade);

            // modelBuilder.Entity<SavedId>()
            //     .HasOne(s=>s.SplashArt)
            //     .WithOne()
            //     .HasForeignKey(typeof(ImageObj))
            //     .OnDelete(DeleteBehavior.Cascade);

            // modelBuilder.Entity<SavedId>()
            //     .HasOne(s=>s.SinnerIcon)
            //     .WithOne()
            //     .HasForeignKey<SavedId>(a => a.SinnerIconKey)
            //     .OnDelete(DeleteBehavior.Cascade);

            // modelBuilder.Entity<SavedId>()
            //     .HasOne(s=>s.Skill)
            //     .WithOne()
            //     .HasForeignKey<SavedId>(a => a.SavedSkillId)
            //     .OnDelete(DeleteBehavior.Cascade);

            // modelBuilder.Entity<SavedEgo>()
            //     .HasOne(s=>s.SplashArt)
            //     .WithOne()
            //     .HasForeignKey<SavedEgo>(a => a.SplashArtKey)
            //     .OnDelete(DeleteBehavior.Cascade);

            // modelBuilder.Entity<SavedEgo>()
            //     .HasOne(s=>s.SinnerIcon)
            //     .WithOne()
            //     .HasForeignKey<SavedEgo>(a => a.SinnerIconKey)
            //     .OnDelete(DeleteBehavior.Cascade);

            // modelBuilder.Entity<SavedEgo>()
            //     .HasOne(s=>s.Skill)
            //     .WithOne()
            //     .HasForeignKey<SavedEgo>(a => a.SavedSkillId)
            //     .OnDelete(DeleteBehavior.Cascade);

            // modelBuilder.Entity<OffenseSkill>()
            //     .HasOne(s=>s.ImageAttach)
            //     .WithOne()
            //     .HasForeignKey<OffenseSkill>(a => a.ImageAttachKey)
            //     .OnDelete(DeleteBehavior.Cascade);

            // modelBuilder.Entity<DefenseSkill>()
            //     .HasOne(s=>s.ImageAttach)
            //     .WithOne()
            //     .HasForeignKey<DefenseSkill>(a => a.ImageAttachKey)
            //     .OnDelete(DeleteBehavior.Cascade);

            // modelBuilder.Entity<CustomEffect>()
            //     .HasOne(s=>s.ImageAttach)
            //     .WithOne()
            //     .HasForeignKey<CustomEffect>(a => a.ImageAttachKey)
            //     .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<SavedIDInfo>()
                .HasOne(s=>s.Saved)
                .WithOne()
                .HasForeignKey<SavedId>(s=>s.Id)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<SavedEGOInfo>()
                .HasOne(s=>s.Saved)
                .WithOne()
                .HasForeignKey<SavedEgo>(s=>s.Id)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<SavedId>()
                .HasOne(s=>s.Skill)
                .WithOne()
                .HasForeignKey<SavedSkill>("FK_SavedId_SavedSkill_key")
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<SavedEgo>()
                .HasOne(s=>s.Skill)
                .WithOne()
                .HasForeignKey<SavedSkill>("FK_SavedEgo_SavedSkill_key")
                .OnDelete(DeleteBehavior.Cascade);

        }
        public DbSet<User> Users { get; set; }
        public DbSet<SavedSkill> SavedSkill { get; set; }
        public DbSet<SavedIDInfo> SavedIDInfos { get; set; }
        public DbSet<SavedEGOInfo> SavedEGOInfos { get; set; }
        public DbSet<SavedId> SavedId { get; set; }
        public DbSet<SavedEgo> SavedEgo { get; set; }
        public DbSet<PassiveSkill> PassiveSkill { get; set; }
        public DbSet<OffenseSkill> OffenseSkill { get; set; }
        public DbSet<MentalEffect> MentalEffect { get; set; }
        public DbSet<DefenseSkill> DefenseSkill { get; set; }
        public DbSet<CustomEffect> CustomEffect { get; set; }
        public DbSet<Comment> Comment { get; set; }
        public DbSet<Tag> Tag { get; set; }
        public DbSet<Post> Post { get; set; }
        public DbSet<PostView> PostView { get; set; }
        public DbSet<Session> Session { get; set; }
        public DbSet<ImageObj> ImageObjs { get; set; }
    }

}
