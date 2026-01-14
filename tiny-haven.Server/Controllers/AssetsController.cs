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
    public class AssetsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AssetsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Assets
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AssetDTO>>> GetAssets()
        {
            return await _context.Assets
                            .Select(a => new AssetDTO
                            {
                                AssetId = a.AssetId,
                                Name = a.Name,
                                ImageUrl = a.ImageUrl,
                                SpanX = a.SpanX,
                                SpanY = a.SpanY,
                                Collision = a.Collision,
                                Visible = a.Visible,
                                CategoryName = a.Category.Name
                            })
                            .ToListAsync();
        }

        // GET: api/Assets/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AssetDTO>> GetAsset(int id)
        {
            var asset = await _context.Assets
                                .Where(a => a.AssetId == id)
                                .Select(a => new AssetDTO
                                {
                                    AssetId = a.AssetId,
                                    Name = a.Name,
                                    ImageUrl = a.ImageUrl,
                                    SpanX = a.SpanX,
                                    SpanY = a.SpanY,
                                    Collision = a.Collision,
                                    Visible = a.Visible,
                                    CategoryName = a.Category.Name
                                })
                                .FirstOrDefaultAsync();

            if (asset == null)
            {
                return NotFound();
            }

            return asset;
        }
    }
}
