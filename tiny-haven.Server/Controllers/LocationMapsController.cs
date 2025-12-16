using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using tiny_haven.Server.Data;
using tiny_haven.Server.Models;

namespace tiny_haven.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationMapsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LocationMapsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/LocationMaps
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LocationMap>>> GetLocationMaps()
        {
            return await _context.LocationMaps
                                 .Include(lm => lm.Asset)
                                 .ToListAsync();
        }

        // GET: api/LocationMaps/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LocationMap>> GetLocationMap(int id)
        {
            var locationMap = await _context.LocationMaps
                                            .Include(lm => lm.Asset)
                                            .FirstOrDefaultAsync(lm => lm.LocationId == id);

            if (locationMap == null)
            {
                return NotFound();
            }

            return locationMap;
        }
    }
}
