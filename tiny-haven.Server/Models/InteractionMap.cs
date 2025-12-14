using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace tiny_haven.Server.Models
{
    public class InteractionMap
    {
        [Key]
        public int InteractionId { get; set; }

        public int xOffsetStart { get; set; }
        public int xOffsetEnd { get; set; }
        public int yOffsetStart { get; set; }
        public int yOffsetEnd { get; set; }


        // Foreign Keys
        public int InteractionTypeId { get; set; }

        [ForeignKey("InteractionTypeId")]
        public InteractionType InteractionType { get; set; }


        public int LocationId { get; set; }

        [ForeignKey("LocationId")]
        public LocationMap LocationMap { get; set; }


        public int? QuestId { get; set; }

        [ForeignKey("QuestId")]
        public Quest? Quest { get; set; }
    }
}
