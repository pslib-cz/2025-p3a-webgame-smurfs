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
        public DbSet<InteractionType> InteractionTypes { get; set; }
        public DbSet<LocationMap> LocationMaps { get; set; }
        public DbSet<Quest> Quests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Category>().HasData(
                new Category
                {
                    CategoryId = 1,
                    Name = "Default"
                }
            );

            modelBuilder.Entity<Asset>().HasData(
                new Asset
                {
                    AssetId = 1,
                    Name = "Wooden Crate",
                    ImageUrl = "images/assets/wooden_crate.png",
                    SpanX = 1,
                    SpanY = 1,
                    Collision = true,
                    CategoryId = 1
                },

                new Asset
                {
                    AssetId = 2,
                    Name = "Labubu",
                    ImageUrl = "images/labubu.png",
                    SpanX = 1,
                    SpanY = 1,
                    Collision = true,
                    CategoryId = 1
                }
            );

            //modelBuilder.Entity<Asset>()
            //    .HasIndex(a => a.Name)
            //    .IsUnique();
        }
    }
}