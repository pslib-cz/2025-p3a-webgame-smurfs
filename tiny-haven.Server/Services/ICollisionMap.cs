namespace tiny_haven.Server.Services
{
    public interface ICollisionMap
    {
        Task<bool[][]> GetCollisionMapAsync();
    }
}
