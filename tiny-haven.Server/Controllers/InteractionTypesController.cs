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
    public class InteractionTypesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InteractionTypesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/InteractionTypes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InteractionType>>> GetInteractionTypes()
        {
            return await _context.InteractionTypes.ToListAsync();
        }

        // GET: api/InteractionTypes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InteractionType>> GetInteractionType(int id)
        {
            var interactionType = await _context.InteractionTypes.FindAsync(id);

            if (interactionType == null)
            {
                return NotFound();
            }

            return interactionType;
        }
    }
}
