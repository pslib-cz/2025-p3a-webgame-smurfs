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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Quest>()
                .HasOne(q => q.NextQuest)
                .WithMany()                     
                .HasForeignKey(q => q.NextQuestId)
                .OnDelete(DeleteBehavior.SetNull);

            //modelBuilder.Entity<Asset>()
            //    .HasIndex(a => a.Name)
            //    .IsUnique();
        }
    }
}