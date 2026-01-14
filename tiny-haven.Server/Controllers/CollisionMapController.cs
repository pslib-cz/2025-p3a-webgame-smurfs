using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using tiny_haven.Server.Data;

namespace tiny_haven.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CollisionMapController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public CollisionMapController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpGet()]
        public async Task<ActionResult<bool[][]>> GetCollisionMap()
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

            return Ok(map);
        }
    }
}
