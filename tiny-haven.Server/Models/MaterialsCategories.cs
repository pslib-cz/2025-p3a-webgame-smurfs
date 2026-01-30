using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace tiny_haven.Server.Models
{
    public class MaterialsCategories
    {
        [Key]
        public int MaterialsCategoriesId { get; set; }
        public string Name { get; set; }

        [InverseProperty("Category")]
        public ICollection<Materials> Materials { get; set; }

        [InverseProperty("MaterialCategory")]
        public ICollection<ItemConfig> ItemConfigs { get; set; }
    }
}
