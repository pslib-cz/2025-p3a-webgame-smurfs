using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using tiny_haven.Server.Data;
using tiny_haven.Server.DTOs;

namespace tiny_haven.Server.Services
{
    public class SpawningLogic : ISpawningLogic
    {
        private readonly Random _rng = new Random();
        private readonly IConfiguration _config;
        private readonly AppDbContext _context;

        public SpawningLogic(IConfiguration config, AppDbContext context)
        {
            _config = config;
            _context = context;
        }

        public bool ShouldSpawn(int current, int max)
        {
            if (max <= 0) return false;

            double percent = (double)current / max;
            double chance = Math.Ceiling((1.0 - percent) * 10) / 10;

            chance = Math.Clamp(chance, 0.1, 1.0);

            return _rng.NextDouble() < chance;
        }

        public PointDto? FindValidLocation(bool[][] objectMap, int[,] materialMap, HashSet<(int, int)> occupiedCoords, List<int> allowedTileIds)
        {
            int rows = _config.GetValue<int>("GameSettings:GridRows");
            int cols = _config.GetValue<int>("GameSettings:GridColumns");
            var allowedSet = new HashSet<int>(allowedTileIds);

            for (int attempt = 0; attempt < 50; attempt++)
            {
                int x = _rng.Next(0, cols);
                int y = _rng.Next(0, rows);

                // Out of bounds check
                if (x >= cols || y >= rows) continue;

                // Collision check
                if (objectMap[y][x]) continue;

                // Material check
                if (allowedSet.Count > 0 && !allowedSet.Contains(materialMap[x, y]))
                    continue;

                // Occupied check
                if (occupiedCoords.Contains((x, y))) continue;

                return new PointDto { X = x, Y = y };
            }

            return null;
        }
    }
}
