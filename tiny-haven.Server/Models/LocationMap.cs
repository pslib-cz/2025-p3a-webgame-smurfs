using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace tiny_haven.Server.Models
{
    public class LocationMap
    {
        [Key]
        public int LocationId { get; set; }
        
        public int LocationX { get; set; }
        public int LocationY { get; set; }


        // Foreign Key
        public int AssetId { get; set; }

        [ForeignKey("AssetId")]
        public Asset Asset { get; set; }


        // Navigation property
        public ICollection<InteractionMap> InteractionMaps { get; set; }
    }
}
