using Microsoft.EntityFrameworkCore;
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
        private readonly AppDbContext _context;
        private const uint ROTATION_MASK = 0x1FFFFFFF;

        public MapSeederService(IServiceProvider serviceProvider, IWebHostEnvironment env, AppDbContext context)
        {
            _serviceProvider = serviceProvider;
            _env = env;
            _context = context;
        }

        private bool IsVisibleTile(int assetId)
        {
            var asset = _context.Assets.Where(a => a.AssetId == assetId).FirstOrDefault();
            return asset.Visible;
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

            // Lookup table for GID to AssetId
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

                // Fetch existing LocationMap entries
                var existingLocations = await context.LocationMaps
                    .ToDictionaryAsync(x => x.LocationId);

                // Check existing IDs
                var processedIds = new HashSet<int>();

                foreach (var layer in mapData.Layers)
                {
                    if (layer.Type == "objectgroup" && layer.Objects != null)
                    {
                        foreach (var obj in layer.Objects)
                        {
                            uint cleanGid = obj.Gid & ROTATION_MASK;

                            if (!gidToAssetId.TryGetValue(cleanGid, out int assetId))
                                continue;

                            // Check if the asset is visible
                            if (!IsVisibleTile(assetId))
                                continue;

                            int tiledObjectId = obj.Id;
                            processedIds.Add(tiledObjectId);

                            // Convert pixel coordinates to grid coordinates
                            int gridX = (int)Math.Round(obj.X / mapData.TileWidth) + 1;
                            int gridY = (int)Math.Round(obj.Y / mapData.TileHeight) + 1;

                            // Insert or Update
                            if (existingLocations.TryGetValue(tiledObjectId, out var existingEntity))
                            {
                                // Update
                                bool hasChanged = existingEntity.LocationX != gridX ||
                                                  existingEntity.LocationY != gridY ||
                                                  existingEntity.AssetId != assetId;

                                if (hasChanged)
                                {
                                    existingEntity.LocationX = gridX;
                                    existingEntity.LocationY = gridY;
                                    existingEntity.AssetId = assetId;
                                }
                            }
                            else
                            {
                                // Insert
                                var newEntity = new LocationMap
                                {
                                    LocationId = tiledObjectId,
                                    AssetId = assetId,
                                    LocationX = gridX,
                                    LocationY = gridY
                                };
                                context.LocationMaps.Add(newEntity);
                            }
                        }
                    }
                }

                // Delet removed entries
                var idsToDelete = existingLocations.Keys
                    .Where(id => !processedIds.Contains(id))
                    .ToList();

                if (idsToDelete.Any())
                {
                    var entitiesToDelete = existingLocations.Values
                        .Where(e => idsToDelete.Contains(e.LocationId));

                    context.LocationMaps.RemoveRange(entitiesToDelete);
                }

                await context.SaveChangesAsync();
            }
        }
    }
}
