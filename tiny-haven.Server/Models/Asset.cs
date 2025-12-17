using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace tiny_haven.Server.Models
{
    public class Asset
    {
        [Key]
        public int AssetId { get; set; }

        [StringLength(200)]
        [RegularExpression(@"^[a-z0-9_]+$", ErrorMessage = "Use snake_case (e.g. green_apple)")]
        public string Name { get; set; }

        public string? ImageUrl { get; set; }

        public int SpanX { get; set; }
        public int SpanY { get; set; }

        public bool Collision { get; set; }

        public bool Visible { get; set; }


        // Foreign Key
        public int CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        public Category Category { get; set; }


        // Navigation properties
        //[InverseProperty("Asset")]
        //public ICollection<LocationMap> LocationMaps { get; set; }

        [InverseProperty("WantedItem")]
        public ICollection<Quest> WantedInQuests { get; set; }

        [InverseProperty("RewardItem")]
        public ICollection<Quest> RewardInQuests { get; set; }
    }
}
