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
            double percent = (double)current / max;
            double chance = 1.0;

            if (percent >= 0.90) chance = 0.10;
            else if (percent >= 0.80) chance = 0.20;
            else if (percent >= 0.70) chance = 0.30;
            else if (percent >= 0.60) chance = 0.40;
            else if (percent >= 0.50) chance = 0.50;
            else if (percent >= 0.40) chance = 0.60;
            else if (percent >= 0.30) chance = 0.70;
            else if (percent >= 0.20) chance = 0.80;
            else if (percent >= 0.10) chance = 0.90;
            else if (percent >= 0.0) chance = 1.0;

            return _rng.NextDouble() < chance;
        }

        public PointDto? FindValidLocation(
            bool[][] collisionMap,
            int[,] materialMap,
            HashSet<(int, int)> occupiedCoords,
            List<int> allowedTileIds)
        {
            int rows = _config.GetValue<int>("GameSettings:GridRows");
            int cols = _config.GetValue<int>("GameSettings:GridColumns");
            var allowedSet = new HashSet<int>(allowedTileIds);

            for (int attempt = 0; attempt < 50; attempt++)
            {
                int x = _rng.Next(0, cols);
                int y = _rng.Next(0, rows);

                if (x >= cols || y >= rows) continue;

                if (collisionMap[y][x]) continue;

                int tileOnMap = materialMap[x, y];

                if (allowedSet.Count > 0 && !allowedSet.Contains(tileOnMap))
                    continue;

                if (occupiedCoords.Contains((x, y))) continue;

                return new PointDto { X = x, Y = y };
            }

            return null;
        }
    }
}
