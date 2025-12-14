using System.ComponentModel.DataAnnotations;

namespace tiny_haven.Server.Models
{
    public class Category
    {
        [Key]
        public int CategoryId { get; set; }

        [StringLength(100)]
        public string Name { get; set; }


        // Navigation property
        public ICollection<Asset> Assets { get; set; }
    }
}
