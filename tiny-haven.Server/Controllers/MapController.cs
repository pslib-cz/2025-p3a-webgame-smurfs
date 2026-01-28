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
        private readonly IMaterials _materials;
        private readonly ISpawningLogic _spawner;

        public MapController(AppDbContext context, ICollisionMap collisionMap, IMaterials materials, ISpawningLogic spawner)
        {
            _context = context;
            _collisionMap = collisionMap;
            _materials = materials;
            _spawner = spawner;
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

        // GET: api/map/interactions
        [HttpGet("interactions")]
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

        [HttpPost("generateItems")]
        public async Task<IActionResult> GenerateItems([FromBody] SpawnRequestDto request)
        {
            // Retrieve item configuration
            var itemConfig = await _context.ItemConfigs.
                                            Where(i => i.AssetId == request.ItemId)
                                            .FirstOrDefaultAsync();
            if (itemConfig == null) return NotFound($"Item with AssetId {request.ItemId} not found.");

            // Get allowed tile IDs for spawning
            var allowedTileIds = await _context.Materials
                .Where(m => m.MaterialCategoryId == itemConfig.AllowedMaterialId)
                .Select(m => m.MaterialId)
                .ToListAsync();

            // Get maps
            var collisionMap = await _collisionMap.GetCollisionMapAsync();
            var materialMap = _materials.TileGrid;

            // Prepare occupied locations set
            var occupiedSet = new HashSet<(int, int)>();
            foreach (var loc in request.ExistingItemLocations)
                occupiedSet.Add((loc.X, loc.Y));

            // Generate new item locations
            var newItems = new List<GeneratedItemDto>();

            for (int i = 0; i < (itemConfig.GeneratingLimit - request.CurrentAmount); i++)
            {
                int projectedTotal = request.CurrentAmount + newItems.Count;
                if (projectedTotal >= itemConfig.GeneratingLimit) break;

                if (!_spawner.ShouldSpawn(projectedTotal, itemConfig.GeneratingLimit)) continue;

                var validCoord = _spawner.FindValidLocation(
                    collisionMap,
                    materialMap,
                    occupiedSet,
                    allowedTileIds
                );

                if (validCoord != null)
                {
                    var newItem = new GeneratedItemDto
                    {
                        X = validCoord.X,
                        Y = validCoord.Y,
                        AssetId = request.ItemId
                    };

                    newItems.Add(newItem);
                    occupiedSet.Add((validCoord.X, validCoord.Y));
                }
            }

            return Ok(new { Success = newItems.Count > 0, NewItems = newItems });
        }
    }
}
