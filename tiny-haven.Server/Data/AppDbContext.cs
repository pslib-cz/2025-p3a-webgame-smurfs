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
                }
            );

            modelBuilder.Entity<Asset>().HasData(
                new Asset
                {
                    AssetId = 1,
                    Name = "Wooden_Crate",
                    SpanX = 1,
                    SpanY = 1,
                    Collision = true,
                    CategoryId = 1
                },

                new Asset
                {
                    AssetId = 2,
                    Name = "Labubu",
                    SpanX = 1,
                    SpanY = 1,
                    Collision = true,
                    CategoryId = 1
                },

                new Asset
                {
                    AssetId = 3,
                    Name = "bush_smurfberries",
                    ImageUrl = "images/bush_smurfberries.svg",
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