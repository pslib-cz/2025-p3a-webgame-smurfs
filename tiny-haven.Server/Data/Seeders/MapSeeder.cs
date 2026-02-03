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
        private const uint ROTATION_MASK = 0x1FFFFFFF;

        public MapSeederService(IServiceProvider serviceProvider, IWebHostEnvironment env)
        {
            _serviceProvider = serviceProvider;
            _env = env;
        }

        private class TileMetadata
        {
            public int AssetId { get; set; }
            public bool IsInteraction { get; set; }
            public int QuestId { get; set; }
            public int XOffStart { get; set; }
            public int XOffEnd { get; set; }
            public int YOffStart { get; set; }
            public int YOffEnd { get; set; }
        }

        public async Task SeedMapAsync()
        {
            // Load JSON
            string mapPath = Path.Combine(_env.ContentRootPath, "Data", "Map", "map.json");
            if (!File.Exists(mapPath))
            {
                Console.WriteLine($"❌ Map file not found: {mapPath}");
                return;
            }

            string json = await File.ReadAllTextAsync(mapPath);
            var mapData = JsonSerializer.Deserialize<TiledMapDto>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (mapData == null) return;

            // Build lookup
            var metadataLookup = new Dictionary<uint, TileMetadata>();

            foreach (var tileset in mapData.Tilesets)
            {
                if (tileset.Tiles == null) continue;

                foreach (var tile in tileset.Tiles)
                {
                    uint globalId = (uint)(tileset.FirstGid + tile.Id);

                    var props = tile.Properties?.ToDictionary(p => p.Name.ToLower(), p => p.Value);

                    if (props != null && props.TryGetValue("game id", out var gameIdVal))
                    {
                        var meta = new TileMetadata
                        {
                            AssetId = gameIdVal.GetInt32()
                        };

                        if (props.TryGetValue("questid", out var questIdVal))
                        {
                            meta.IsInteraction = true;
                            meta.QuestId = questIdVal.GetInt32();

                            meta.XOffStart = GetIntSafe(props, "xoffsetstart");
                            meta.XOffEnd = GetIntSafe(props, "xoffsetend");
                            meta.YOffStart = GetIntSafe(props, "yoffsetstart");
                            meta.YOffEnd = GetIntSafe(props, "yoffsetend");
                        }

                        metadataLookup[globalId] = meta;
                    }
                }
            }

            // Sync to db
            using (var scope = _serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                var existingLocations = await context.LocationMaps.ToDictionaryAsync(x => x.LocationId);
                var existingInteractions = await context.InteractionMaps.ToDictionaryAsync(x => x.LocationId);

                var processedIds = new HashSet<int>();

                foreach (var layer in mapData.Layers)
                {
                    if (layer.Type == "objectgroup" && layer.Objects != null)
                    {
                        foreach (var obj in layer.Objects)
                        {
                            uint cleanGid = obj.Gid & ROTATION_MASK;

                            if (!metadataLookup.TryGetValue(cleanGid, out var meta))
                                continue;

                            int tiledObjectId = obj.Id;
                            processedIds.Add(tiledObjectId);

                            int gridX = (int)Math.Round(obj.X / mapData.TileWidth) + 1;
                            int gridY = (int)Math.Round(obj.Y / mapData.TileHeight) + 1;

                            if (existingLocations.TryGetValue(tiledObjectId, out var locEntity))
                            {
                                if (locEntity.LocationX != gridX ||
                                    locEntity.LocationY != gridY ||
                                    locEntity.AssetId != meta.AssetId)
                                {
                                    locEntity.LocationX = gridX;
                                    locEntity.LocationY = gridY;
                                    locEntity.AssetId = meta.AssetId;
                                }
                            }
                            else
                            {
                                var newLoc = new LocationMap
                                {
                                    LocationId = tiledObjectId,
                                    AssetId = meta.AssetId,
                                    LocationX = gridX,
                                    LocationY = gridY
                                };
                                context.LocationMaps.Add(newLoc);
                            }

                            if (meta.IsInteraction)
                            {
                                if (existingInteractions.TryGetValue(tiledObjectId, out var intEntity))
                                {
                                    if (intEntity.QuestId != meta.QuestId ||
                                        intEntity.xOffsetEnd != meta.XOffEnd)
                                    {
                                        intEntity.QuestId = meta.QuestId;
                                        intEntity.xOffsetStart = meta.XOffStart;
                                        intEntity.xOffsetEnd = meta.XOffEnd;
                                        intEntity.yOffsetStart = meta.YOffStart;
                                        intEntity.yOffsetEnd = meta.YOffEnd;
                                    }
                                }
                                else
                                {
                                    context.InteractionMaps.Add(new InteractionMap
                                    {
                                        LocationId = tiledObjectId,
                                        QuestId = meta.QuestId,
                                        xOffsetStart = meta.XOffStart,
                                        xOffsetEnd = meta.XOffEnd,
                                        yOffsetStart = meta.YOffStart,
                                        yOffsetEnd = meta.YOffEnd
                                    });
                                }
                            }
                            else
                            {
                                if (existingInteractions.ContainsKey(tiledObjectId))
                                {
                                    context.InteractionMaps.Remove(existingInteractions[tiledObjectId]);
                                }
                            }
                        }
                    }
                }

                // Delete removed
                var idsToDelete = existingLocations.Keys.Where(id => !processedIds.Contains(id)).ToList();

                if (idsToDelete.Any())
                {
                    var locsToDelete = existingLocations.Values.Where(x => idsToDelete.Contains(x.LocationId));
                    context.LocationMaps.RemoveRange(locsToDelete);

                    var intsToDelete = existingInteractions.Values.Where(x => idsToDelete.Contains(x.LocationId));
                    context.InteractionMaps.RemoveRange(intsToDelete);

                    Console.WriteLine($"🗑️ Removed {idsToDelete.Count} deleted objects from DB.");
                }

                await context.SaveChangesAsync();
                Console.WriteLine("✅ Map Sync Complete!");
            }
        }

        private int GetIntSafe(Dictionary<string, JsonElement> props, string key)
        {
            if (props.TryGetValue(key, out var val) && val.ValueKind == JsonValueKind.Number)
            {
                return val.GetInt32();
            }
            return 0;
        }
    }
}
