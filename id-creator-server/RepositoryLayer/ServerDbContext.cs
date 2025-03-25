using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using RepositoryLayer.Models;
using RepositoryLayer.Utils.RabbitMQPublisher;

namespace RepositoryLayer
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
                using(var scope = _services.CreateScope())
                {
                    var rabbitMQDeletingImagePublisher = scope.ServiceProvider.GetRequiredService<RabbitMQDeletingImagePublisher>();
                    rabbitMQDeletingImagePublisher.PublishDeleteImage(image.Id.ToString());
                }
            }

            return await base.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
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