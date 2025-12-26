namespace tiny_haven.Server.DTOs
{
    public class AssetDTO
    {
        public int AssetId { get; set; }
        public string Name { get; set; }
        public string? ImageUrl { get; set; }
        public int SpanX { get; set; }
        public int SpanY { get; set; }
        public bool Collision { get; set; }
        public bool Visible { get; set; }
        public string CategoryName { get; set; }
    }
}
