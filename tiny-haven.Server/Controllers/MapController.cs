using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using tiny_haven.Server.Data;
using tiny_haven.Server.DTOs;
using tiny_haven.Server.Services;

namespace tiny_haven.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MapController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ICollisionMap _collisionMap;

        public MapController(AppDbContext context, ICollisionMap collisionMap)
        {
            _context = context;
            _collisionMap = collisionMap;
        }

        // GET: api/map/locations
        [HttpGet("locations")]
        public async Task<ActionResult<IEnumerable<LocationMapDTO>>> GetLocationMaps()
        {
            return await _context.LocationMaps
                            .Select(lm => new LocationMapDTO
                            {
                                LocationId = lm.LocationId,
                                LocationX = lm.LocationX,
                                LocationY = lm.LocationY,
                                AssetId = lm.Asset.AssetId,
                                ImageUrl = lm.Asset.ImageUrl,
                                Name = lm.Asset.Name,
                                SpanX = lm.Asset.SpanX,
                                SpanY = lm.Asset.SpanY,
                                Collision = lm.Asset.Collision,
                                Visible = lm.Asset.Visible
                            })
                            .ToListAsync();
        }

        // GET: api/map/collisions
        [HttpGet("collisions")]
        public async Task<ActionResult<bool[][]>> GetCollision()
        {
            var data = await _collisionMap.GetCollisionMapAsync();
            return Ok(data);
        }
    }
}
