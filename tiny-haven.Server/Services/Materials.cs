using System.Text.Json;
using tiny_haven.Server.DTOs;

namespace tiny_haven.Server.Services
{
    public class MaterialService
    {
        private readonly IWebHostEnvironment _env;
        public int[,] TileGrid { get; private set; }

        private const long ROTATION_MASK = 0x1FFFFFFF;

        public MaterialService(IWebHostEnvironment env)
        {
            _env = env;
            LoadMap();
        }

        private void LoadMap()
        {
            string mapPath = Path.Combine(_env.ContentRootPath, "Data", "Map", "map.json");

            if (!File.Exists(mapPath))
            {
                TileGrid = new int[0, 0];
                return;
            }

            string jsonContent = File.ReadAllText(mapPath);
            var mapData = JsonSerializer.Deserialize<TiledMapDto>(jsonContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (mapData == null) return;

            TileGrid = new int[mapData.Width, mapData.Height];

            var groundLayer = mapData.Layers.FirstOrDefault(l => l.Type == "tilelayer");

            if (groundLayer != null && groundLayer.Data != null)
            {
                for (int i = 0; i < groundLayer.Data.Count; i++)
                {
                    int x = i % mapData.Width;
                    int y = i / mapData.Width;

                    long rawGid = groundLayer.Data[i];
                    int cleanGid = (int)(rawGid & ROTATION_MASK);

                    TileGrid[x, y] = cleanGid;
                }
            }
        }
    }
}
