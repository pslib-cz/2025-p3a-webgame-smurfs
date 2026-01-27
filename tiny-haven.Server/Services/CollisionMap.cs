using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using tiny_haven.Server.Data;

namespace tiny_haven.Server.Services
{
    public class CollisionMap : ICollisionMap
    {
        private readonly AppDbContext _context;
        private readonly IMemoryCache _cache;
        private readonly IConfiguration _config;
        private readonly MaterialService _materialService;

        private readonly int[] _waterIds = { 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 42, 43, 44 };

        public CollisionMap(AppDbContext context, IMemoryCache cache, IConfiguration config, MaterialService materialService)
        {
            _context = context;
            _cache = cache;
            _config = config;
            _materialService = materialService;
        }

        public async Task<bool[][]> GetCollisionMapAsync()
        {
            if (_cache.TryGetValue("CollisionMap", out bool[][] cachedMap))
            {
                return cachedMap;
            }

            var map = await GenerateMapFromDbAsync();

            _cache.Set("CollisionMap", map, TimeSpan.FromMinutes(10));

            return map;
        }

        private bool IsCollisionTile(string assetName, int x, int y, int spanX, int spanY)
        {
            if (assetName == "oak_tree")
            {
                bool isEdgeX = (x == 0 || x == spanX - 1);
                bool isEdgeY = (y == spanY - 1);

                if (isEdgeX && isEdgeY) return false;
            }

            return true;
        }

        private async Task<bool[][]> GenerateMapFromDbAsync()
        {
            int rows = _config.GetValue<int>("GameSettings:GridRows");
            int cols = _config.GetValue<int>("GameSettings:GridColumns");

            bool[][] map = new bool[rows][];
            for (int i = 0; i < rows; i++) map[i] = new bool[cols];

            var tileGrid = _materialService.TileGrid;
            int maxCsvX = tileGrid.GetLength(0);
            int maxCsvY = tileGrid.GetLength(1);

            DebugTileAt(72, 39);
            DebugTileAt(74, 37);
            DebugTileAt(80, 34);

            for (int y = 0; y < rows; y++)
            {
                for (int x = 0; x < cols; x++)
                {
                    if (x < maxCsvX && y < maxCsvY)
                    {
                        int tileId = tileGrid[x, y];

                        if (_waterIds.Contains(tileId))
                        {
                            map[y][x] = true;
                        }
                    }
                }
            }

            var entities = await _context.LocationMaps
                .Include(x => x.Asset)
                .Where(x => x.Asset.Collision == true)
                .ToListAsync();

            foreach (var entity in entities)
            {
                int spanX = entity.Asset.SpanX;
                int spanY = entity.Asset.SpanY;

                for (int cy = 0; cy < spanY; cy++)
                {
                    int tY = (entity.LocationY - 1) + cy;
                    if (tY < 0 || tY >= rows) continue;

                    for (int cx = 0; cx < spanX; cx++)
                    {
                        int tX = (entity.LocationX - 1) + cx;
                        if (tX < 0 || tX >= cols) continue;

                        if (IsCollisionTile(entity.Asset.Name, cx, cy, entity.Asset.SpanX, entity.Asset.SpanY))
                        {
                            map[tY][tX] = true;
                        }
                    }
                }
            }

            return map;
        }

        public void DebugTileAt(int gameX, int gameY)
        {
            // 1. Convert Game Coordinate (e.g. 68) to Array Index (e.g. 67)
            // Your game uses 1-based coords, so we subtract 1.
            int arrayX = gameX - 1;
            int arrayY = gameY - 1;

            var grid = _materialService.TileGrid;

            // 2. Safety Check
            if (arrayX < 0 || arrayX >= grid.GetLength(0) ||
                arrayY < 0 || arrayY >= grid.GetLength(1))
            {
                Console.WriteLine($"❌ DEBUG [{gameX},{gameY}]: Coordinate out of bounds!");
                return;
            }

            // 3. Get the ID
            int foundId = grid[arrayX, arrayY];
            bool isCollision = _waterIds.Contains(foundId);

            // 4. Print the Result
            Console.WriteLine($"\n🔍 --- DEBUG INSPECTOR [{gameX}, {gameY}] ---");
            Console.WriteLine($"   Array Index: [{arrayX}, {arrayY}]");
            Console.WriteLine($"   Tile ID Found: {foundId}");

            if (isCollision)
            {
                Console.WriteLine($"   Status: ✅ BLOCKED (ID {foundId} is in your list)");
            }
            else
            {
                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.WriteLine($"   Status: ⚠️ WALKABLE (ID {foundId} is missing!)");
                Console.WriteLine($"   >>> ACTION: Add {foundId} to your _waterIds array.");
                Console.ResetColor();
            }
            Console.WriteLine("------------------------------------------\n");
        }
    }
}