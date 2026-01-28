using System.Text.Json;
using tiny_haven.Server.Data;
using tiny_haven.Server.DTOs;
using tiny_haven.Server.Models;

namespace tiny_haven.Server.Data.Seeders
{
    public class MapSeederService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IWebHostEnvironment _env;
        private const uint ROTATION_MASK = 0x1FFFFFFF;

        public MapSeederService(IServiceProvider serviceProvider, IWebHostEnvironment env)
        {
            _serviceProvider = serviceProvider;
            _env = env;
        }

        public async Task SeedMapAsync()
        {
            string mapPath = Path.Combine(_env.ContentRootPath, "Data", "Map", "map.json");
            if (!File.Exists(mapPath)) return;

            string json = await File.ReadAllTextAsync(mapPath);
            var mapData = JsonSerializer.Deserialize<TiledMapDto>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (mapData == null) return;

            var gidToAssetId = new Dictionary<uint, int>();

            foreach (var tileset in mapData.Tilesets)
            {
                if (tileset.Tiles == null) continue;
                foreach (var tile in tileset.Tiles)
                {
                    uint globalId = (uint)(tileset.FirstGid + tile.Id);

                    var prop = tile.Properties?.FirstOrDefault(p => p.Name == "game ID");
                    if (prop != null && prop.Value.ValueKind == JsonValueKind.Number)
                    {
                        gidToAssetId[globalId] = prop.Value.GetInt32();
                    }
                }
            }

            using (var scope = _serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                context.LocationMaps.RemoveRange(context.LocationMaps);
                await context.SaveChangesAsync();

                var newLocations = new List<LocationMap>();

                foreach (var layer in mapData.Layers)
                {
                    if (layer.Type == "objectgroup" && layer.Objects != null)
                    {
                        foreach (var obj in layer.Objects)
                        {
                            uint cleanGid = obj.Gid & ROTATION_MASK;

                            if (gidToAssetId.TryGetValue(cleanGid, out int assetId))
                            {
                                int gridX = (int)Math.Round(obj.X / mapData.TileWidth) + 1;
                                int gridY = (int)Math.Round(obj.Y / mapData.TileHeight) + 1;

                                newLocations.Add(new LocationMap
                                {
                                    AssetId = assetId,
                                    LocationX = gridX,
                                    LocationY = gridY
                                });
                            }
                        }
                    }
                }

                if (newLocations.Any())
                {
                    await context.LocationMaps.AddRangeAsync(newLocations);
                    await context.SaveChangesAsync();
                }
            }
        }
    }
}
