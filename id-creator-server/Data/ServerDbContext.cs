using Microsoft.EntityFrameworkCore;
using Server.Models;
using Server.Util.RabbitMQPublisher;

namespace Server.Data
{
    public class ServerDbContext: DbContext
    {
        private readonly IServiceProvider _services;
        public ServerDbContext(DbContextOptions<ServerDbContext> options,IServiceProvider service):base(options)
        {
            _services = service;
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
                .HasOne(s=>s.SavedId)
                .WithOne()
                .HasForeignKey<SavedId>(s=>s.Id)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<SavedEGOInfo>()
                .HasOne(s=>s.SavedEgo)
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
        
        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var deletedImages = ChangeTracker.Entries<ImageObj>()
                .Where(e => e.State == EntityState.Deleted)
                .Select(e => e.Entity);

            foreach(var image in deletedImages)
            {
                using var scope = _services.CreateScope();
                var rabbitMQDeletingImagePublisher = scope.ServiceProvider.GetRequiredService<RabbitMQDeletingImagePublisher>();
                rabbitMQDeletingImagePublisher.PublishDeleteImage(image.Id.ToString());
            }

            return await base.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
        }
        public required DbSet<User> Users { get; set; }
        public required DbSet<SavedSkill> SavedSkill { get; set; }
        public required DbSet<SavedIDInfo> SavedIDInfos { get; set; }
        public required DbSet<SavedEGOInfo> SavedEGOInfos { get; set; }
        public required DbSet<SavedId> SavedId { get; set; }
        public required DbSet<SavedEgo> SavedEgo { get; set; }
        public required DbSet<PassiveSkill> PassiveSkill { get; set; }
        public required DbSet<OffenseSkill> OffenseSkill { get; set; }
        public required DbSet<MentalEffect> MentalEffect { get; set; }
        public required DbSet<DefenseSkill> DefenseSkill { get; set; }
        public required DbSet<CustomEffect> CustomEffect { get; set; }
        public required DbSet<Comment> Comment { get; set; }
        public required DbSet<Tag> Tag { get; set; }
        public required DbSet<Post> Post { get; set; }
        public required DbSet<PostView> PostView { get; set; }
        public required DbSet<Session> Session { get; set; }
        public required DbSet<ImageObj> ImageObjs { get; set; }
    }

}