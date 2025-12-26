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
    public class QuestsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public QuestsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Quests
        [HttpGet]
        public async Task<ActionResult<IEnumerable<QuestDTO>>> GetQuests()
        {
            return await _context.Quests
                            .Select(q => new QuestDTO
                            {
                                QuestId = q.QuestId,
                                Name = q.Name,
                                Description = q.Description,
                                Type = q.Type,
                                WantedItemId = q.WantedItemId,
                                RewardItemId = q.RewardItemId,
                                ItemQuantity = q.ItemQuantity,
                                RewardAmount = q.RewardAmount,
                                NextQuestId = q.NextQuestId
                            })
                            .ToListAsync();
        }

        // GET: api/Quests/5
        [HttpGet("{id}")]
        public async Task<ActionResult<QuestDTO>> GetQuest(int id)
        {
            var quest = await _context.Quests
                                .Where(q => q.QuestId == id)
                                .Select(q => new QuestDTO
                                {
                                    QuestId = q.QuestId,
                                    Name = q.Name,
                                    Description = q.Description,
                                    Type = q.Type,
                                    WantedItemId = q.WantedItemId,
                                    RewardItemId = q.RewardItemId,
                                    ItemQuantity = q.ItemQuantity,
                                    RewardAmount = q.RewardAmount,
                                    NextQuestId = q.NextQuestId
                                })
                                .FirstOrDefaultAsync();

            if (quest == null)
            {
                return NotFound();
            }

            return quest;
        }
    }
}
