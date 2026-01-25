namespace tiny_haven.Server.Services
{
    public class MaterialService
    {
        private readonly IWebHostEnvironment _env;
        public int[,] TileGrid { get; private set; }

        private const uint ROTATION_MASK = 0x0FFFFFFF;

        public MaterialService(IWebHostEnvironment env)
        {
            _env = env;
            LoadMap();
        }

        private void LoadMap()
        {
            string filePath = Path.Combine(_env.ContentRootPath, "Data", "Map", "materials.csv");

            if (File.Exists(filePath))
            {
                TileGrid = LoadMapFromCsv(filePath);
            }
            else
            {
                TileGrid = new int[1, 1];
            }
        }

        private int[,] LoadMapFromCsv(string filePath)
        {
            var lines = File.ReadAllLines(filePath)
                            .Where(l => !string.IsNullOrWhiteSpace(l))
                            .ToArray();

            if (lines.Length == 0) return new int[0, 0];

            int height = lines.Length;
            int width = lines[0].Split(',').Length;

            int[,] mapGrid = new int[width, height];

            for (int y = 0; y < height; y++)
            {
                var rowValues = lines[y].Split(',', System.StringSplitOptions.RemoveEmptyEntries);

                for (int x = 0; x < rowValues.Length; x++)
                {
                    if (long.TryParse(rowValues[x], out long rawGid))
                    {
                        long cleanGid = rawGid & ROTATION_MASK;

                        mapGrid[x, y] = (int)cleanGid;
                    }
                }
            }
            return mapGrid;
        }
    }
}
