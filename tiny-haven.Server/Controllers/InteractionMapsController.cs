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
    public class InteractionMapsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InteractionMapsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/InteractionMaps
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InteractionMap>>> GetInteractionMaps()
        {
            return await _context.InteractionMaps.ToListAsync();
        }

        // GET: api/InteractionMaps/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InteractionMap>> GetInteractionMap(int id)
        {
            var interactionMap = await _context.InteractionMaps.FindAsync(id);

            if (interactionMap == null)
            {
                return NotFound();
            }

            return interactionMap;
        }
    }
}
