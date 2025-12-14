using System.ComponentModel.DataAnnotations;

namespace tiny_haven.Server.Models
{
    public class InteractionType
    {
        [Key]
        public int InteractionTypeId { get; set; }

        [StringLength(250)]
        public string Name { get; set; }


        // Navigation property
        public ICollection<InteractionMap> InteractionMaps { get; set; }
    }
}
