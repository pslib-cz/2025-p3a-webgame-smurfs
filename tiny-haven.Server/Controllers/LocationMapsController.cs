using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using tiny_haven.Server.Data;
using tiny_haven.Server.DTOs;
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
        public async Task<ActionResult<IEnumerable<LocationMapDTO>>> GetLocationMaps()
        {
            return await _context.LocationMaps
                            .Select(lm => new LocationMapDTO
                            {
                                LocationId = lm.LocationId,
                                LocationX = lm.LocationX,
                                LocationY = lm.LocationY,
                                ImageUrl = lm.Asset.ImageUrl,
                                Name = lm.Asset.Name,
                                SpanX = lm.Asset.SpanX,
                                SpanY = lm.Asset.SpanY,
                                Collision = lm.Asset.Collision,
                                Visible = lm.Asset.Visible
                            })
                            .ToListAsync();
        }

        // GET: api/LocationMaps/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LocationMapDTO>> GetLocationMap(int id)
        {
            var locationMap = await _context.LocationMaps
                                .Where(lm => lm.LocationId == id)
                                .Select(lm => new LocationMapDTO
                                {
                                    LocationId = lm.LocationId,
                                    LocationX = lm.LocationX,
                                    LocationY = lm.LocationY,
                                    ImageUrl = lm.Asset.ImageUrl,
                                    Name = lm.Asset.Name,
                                    SpanX = lm.Asset.SpanX,
                                    SpanY = lm.Asset.SpanY,
                                    Collision = lm.Asset.Collision,
                                    Visible = lm.Asset.Visible
                                })
                                .FirstOrDefaultAsync();

            if (locationMap == null)
            {
                return NotFound();
            }

            return locationMap;
        }
    }
}
