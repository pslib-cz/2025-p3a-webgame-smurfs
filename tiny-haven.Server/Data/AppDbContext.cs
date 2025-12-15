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
                    Name = "Nature"
                },
                new Category
                {
                    CategoryId = 2,
                    Name = "Buildings"
                },
                new Category                 {
                    CategoryId = 3,
                    Name = "Characters"
                }
            );

            modelBuilder.Entity<Asset>().HasData(
                new Asset
                {
                    AssetId = 1,
                    Name = "bush_smurfberries",
                    ImageUrl = "images/bush_smurfberries.svg",
                    SpanX = 1,
                    SpanY = 1,
                    Collision = false,
                    CategoryId = 1
                },
                new Asset
                {
                    AssetId = 2,
                    Name = "house_red",
                    ImageUrl = "images/house_red.svg",
                    SpanX = 2,
                    SpanY = 2,
                    Collision = true,
                    CategoryId = 2
                },
                new Asset
                {
                    AssetId = 3,
                    Name = "house_blue",
                    ImageUrl = "images/house_blue.svg",
                    SpanX = 2,
                    SpanY = 2,
                    Collision = true,
                    CategoryId = 2
                },
                new Asset
                {
                    AssetId = 4,
                    Name = "smurf",
                    ImageUrl = "images/smurf.svg",
                    SpanX = 1,
                    SpanY = 1,
                    Collision = true,
                    CategoryId = 3
                },
                new Asset                 {
                    AssetId = 5,
                    Name = "gargamel",
                    ImageUrl = "images/gargamel.svg",
                    SpanX = 3,
                    SpanY = 4,
                    Collision = true,
                    CategoryId = 3
                },
                new Asset
                {
                    AssetId = 6,
                    Name = "stone",
                    ImageUrl = "images/stone.svg",
                    SpanX = 1,
                    SpanY = 1,
                    Collision = false,
                    CategoryId = 1
                },
                new Asset
                {
                    AssetId = 7,
                    Name = "wood",
                    ImageUrl = "images/wood.svg",
                    SpanX = 1,
                    SpanY = 1,
                    Collision = false,
                    CategoryId = 1
                }
            );

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