namespace tiny_haven.Server.DTOs
{
    public class QuestDTO
    {
        public int QuestId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public int? WantedItemId { get; set; }
        public int? RewardItemId { get; set; }
        public int? ItemQuantity { get; set; }
        public int? RewardAmount { get; set; }
        public int? NextQuestId { get; set; }
    }
}
