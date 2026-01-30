using tiny_haven.Server.DTOs;

namespace tiny_haven.Server.Services
{
    public interface ISpawningLogic
    {
        bool ShouldSpawn(int currentAmount, int maxLimit);

        PointDto? FindValidLocation(
            bool[][] objectMap,
            int[,] materialMap,
            HashSet<(int, int)> occupiedCoords,
            List<int> allowedTileIds
        );
    }
}
