namespace tiny_haven.Server.DTOs
{
    public class InteractionMapDTO
    {
        public int InteractionId { get; set; }
        public int xOffsetStart { get; set; }
        public int xOffsetEnd { get; set; }
        public int yOffsetStart { get; set; }
        public int yOffsetEnd { get; set; }
        public int LocationX { get; set; }
        public int LocationY { get; set; }
        public QuestDTO Quest { get; set; }
    }
}
