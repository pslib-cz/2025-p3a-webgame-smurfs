namespace tiny_haven.Server.DTOs
{
    public class SpawnRequestDto
    {
        public int ItemId { get; set; }
        public int CurrentAmount { get; set; }
        public List<PointDto> ExistingItemLocations { get; set; } = new();
    }

    public class PointDto
    {
        public int X { get; set; }
        public int Y { get; set; }
    }
}
