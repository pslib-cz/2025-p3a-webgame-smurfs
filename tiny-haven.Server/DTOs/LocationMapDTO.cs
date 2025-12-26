namespace tiny_haven.Server.DTOs
{
    public class LocationMapDTO
    {
        public int LocationId { get; set; }
        public int LocationX { get; set; }
        public int LocationY { get; set; }
        public string? ImageUrl { get; set; }
        public int SpanX { get; set; }
        public int SpanY { get; set; }
        public bool Collision { get; set; }
        public bool Visible { get; set; }
    }
}
