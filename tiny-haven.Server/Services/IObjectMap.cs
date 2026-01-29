namespace tiny_haven.Server.Services
{
    public interface IObjectMap
    {
        Task<bool[][]> GetObjectMapAsync();
    }
}
