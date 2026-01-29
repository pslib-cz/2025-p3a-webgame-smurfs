using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using tiny_haven.Server.Data;

namespace tiny_haven.Server.Services
{
    public class ObjectMap : IObjectMap
    {
        private readonly AppDbContext _context;
        private readonly IMemoryCache _cache;
        private readonly IConfiguration _config;
        private readonly IMaterials _materialService;

        public ObjectMap(AppDbContext context, IMemoryCache cache, IConfiguration config, IMaterials materialService)
        {
            _context = context;
            _cache = cache;
            _config = config;
            _materialService = materialService;
        }

        public async Task<bool[][]> GetObjectMapAsync()
        {
            if (_cache.TryGetValue("ObjectMap", out bool[][] cachedMap))
            {
                return cachedMap;
            }

            var map = await GenerateMapFromDbAsync();

            _cache.Set("ObjectMap", map, TimeSpan.FromMinutes(10));

            return map;
        }

        private async Task<bool[][]> GenerateMapFromDbAsync()
        {
            int rows = _config.GetValue<int>("GameSettings:GridRows");
            int cols = _config.GetValue<int>("GameSettings:GridColumns");

            bool[][] map = new bool[rows][];
            for (int i = 0; i < rows; i++) map[i] = new bool[cols];

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

                        map[tY][tX] = true;
                    }
                }
            }

            return map;
        }
    }
}
