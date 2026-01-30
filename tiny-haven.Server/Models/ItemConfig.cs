using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace tiny_haven.Server.Models
{
    public class ItemConfig
    {
        [Key]
        public int ItemConfigId { get; set; }

        public int GeneratingLimit { get; set; }

        // Foreign Key
        public int AssetId { get; set; }

        [ForeignKey("AssetId")]
        public Asset Asset { get; set; }

        public int AllowedMaterialId { get; set; }

        [ForeignKey("AllowedMaterialId")]
        public MaterialsCategories MaterialCategory { get; set; }
    }
}
