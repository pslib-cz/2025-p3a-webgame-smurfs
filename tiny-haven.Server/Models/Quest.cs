using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace tiny_haven.Server.Models
{
    public class Quest
    {
        [Key]
        public int QuestId { get; set; }

        [StringLength(200)]
        public string Name { get; set; }

        public string Description { get; set; }

        public int ItemQuantity { get; set; }

        public int RewardAmount { get; set; }


        // Foreign Key
        public int AssetId { get; set; }

        [ForeignKey("AssetId")]
        public Asset Asset { get; set; }

        public int? NextQuestId { get; set; }

        [ForeignKey("NextQuestId")]
        public virtual Quest NextQuest { get; set; }


        // Navigation property
        public ICollection<InteractionMap> InteractionMaps { get; set; }
    }
}
