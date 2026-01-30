using System.Text.Json;
using System.Text.Json.Serialization;

namespace tiny_haven.Server.DTOs
{
    public class TiledMapDto
    {
        [JsonPropertyName("width")] public int Width { get; set; }
        [JsonPropertyName("height")] public int Height { get; set; }
        [JsonPropertyName("tilewidth")] public int TileWidth { get; set; }
        [JsonPropertyName("tileheight")] public int TileHeight { get; set; }
        [JsonPropertyName("tilesets")] public List<TiledTilesetDto> Tilesets { get; set; }
        [JsonPropertyName("layers")] public List<TiledLayerDto> Layers { get; set; }
    }

    public class TiledTilesetDto
    {
        [JsonPropertyName("firstgid")] public int FirstGid { get; set; }
        [JsonPropertyName("tiles")] public List<TiledTileDto> Tiles { get; set; }
    }

    public class TiledTileDto
    {
        [JsonPropertyName("id")] public int Id { get; set; }
        [JsonPropertyName("properties")] public List<TiledPropDto> Properties { get; set; }
    }

    public class TiledPropDto
    {
        [JsonPropertyName("name")] public string Name { get; set; }
        [JsonPropertyName("value")] public JsonElement Value { get; set; }
    }

    public class TiledLayerDto
    {
        [JsonPropertyName("type")] public string Type { get; set; } 
        [JsonPropertyName("data")] public List<uint> Data { get; set; } 
        [JsonPropertyName("objects")] public List<TiledObjectDto> Objects { get; set; }
    }

    public class TiledObjectDto
    {
        [JsonPropertyName("id")] public int Id { get; set; }
        [JsonPropertyName("gid")] public uint Gid { get; set; }
        [JsonPropertyName("x")] public double X { get; set; }
        [JsonPropertyName("y")] public double Y { get; set; }
    }
}
