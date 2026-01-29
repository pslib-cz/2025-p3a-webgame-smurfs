using Microsoft.EntityFrameworkCore;
using tiny_haven.Server.Models;

namespace tiny_haven.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Asset> Assets { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<InteractionMap> InteractionMaps { get; set; }
        public DbSet<LocationMap> LocationMaps { get; set; }
        public DbSet<Quest> Quests { get; set; }
        public DbSet<ItemConfig> ItemConfigs { get; set; }
        public DbSet<MaterialsCategories> MaterialsCategories { get; set; }
        public DbSet<Materials> Materials { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Quest>()
                .HasOne(q => q.NextQuest)
                .WithMany()                     
                .HasForeignKey(q => q.NextQuestId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<LocationMap>(entity =>
            {
                entity.HasKey(e => e.LocationId);
                entity.Property(e => e.LocationId)
                      .ValueGeneratedNever();
            });
        }
    }
}