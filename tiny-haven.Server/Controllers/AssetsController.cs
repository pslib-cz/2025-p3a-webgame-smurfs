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
    public class AssetsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AssetsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Assets
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Asset>>> GetAssets()
        {
            return await _context.Assets.ToListAsync();
        }

        // GET: api/Assets/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Asset>> GetAssetById(int id)
        {
            var asset = await _context.Assets.FindAsync(id);

            if (asset == null)
            {
                return NotFound();
            }

            return asset;
        }

        // GET: api/Assets/apple
        [HttpGet("{name}")]
        public async Task<ActionResult<Asset>> GetAssetByName(string name)
        {
            var asset = await _context.Assets.FirstOrDefaultAsync(a => a.Name == name);

            if (asset == null)
            {
                return NotFound();
            }

            return asset;
        }
    }
}
