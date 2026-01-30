using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace tiny_haven.Server.Models
{
    public class Materials
    {
        [Key]
        public int MaterialId { get; set; }

        // Foreign Key
        public int MaterialCategoryId { get; set; }

        [ForeignKey("MaterialCategoryId")]
        public MaterialsCategories Category { get; set; }
    }
}
