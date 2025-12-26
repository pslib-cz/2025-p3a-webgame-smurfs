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
    public class InteractionMapsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InteractionMapsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/InteractionMaps
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InteractionMapDTO>>> GetInteractionMaps()
        {
            return await _context.InteractionMaps
                            .Select(im => new InteractionMapDTO
                            {
                                InteractionId = im.InteractionId,
                                xOffsetStart = im.xOffsetStart,
                                xOffsetEnd = im.xOffsetEnd,
                                yOffsetStart = im.yOffsetStart,
                                yOffsetEnd = im.yOffsetEnd,
                                Type = im.Quest.Type,
                                LocationX = im.LocationMap.LocationX,
                                LocationY = im.LocationMap.LocationY,
                                Quest = new QuestDTO
                                {
                                    QuestId = im.Quest.QuestId,
                                    Name = im.Quest.Name,
                                    Description = im.Quest.Description,
                                    Type = im.Quest.Type,
                                    WantedItemId = im.Quest.WantedItemId,
                                    RewardItemId = im.Quest.RewardItemId,
                                    ItemQuantity = im.Quest.ItemQuantity,
                                    RewardAmount = im.Quest.RewardAmount,
                                    NextQuestId = im.Quest.NextQuestId
                                }
                            })
                            .ToListAsync();
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

        // PUT: api/InteractionMaps/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInteractionMap(int id, InteractionMap interactionMap)
        {
            if (id != interactionMap.InteractionId)
            {
                return BadRequest();
            }

            _context.Entry(interactionMap).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InteractionMapExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/InteractionMaps
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<InteractionMap>> PostInteractionMap(InteractionMap interactionMap)
        {
            _context.InteractionMaps.Add(interactionMap);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetInteractionMap", new { id = interactionMap.InteractionId }, interactionMap);
        }

        // DELETE: api/InteractionMaps/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInteractionMap(int id)
        {
            var interactionMap = await _context.InteractionMaps.FindAsync(id);
            if (interactionMap == null)
            {
                return NotFound();
            }

            _context.InteractionMaps.Remove(interactionMap);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool InteractionMapExists(int id)
        {
            return _context.InteractionMaps.Any(e => e.InteractionId == id);
        }
    }
}
