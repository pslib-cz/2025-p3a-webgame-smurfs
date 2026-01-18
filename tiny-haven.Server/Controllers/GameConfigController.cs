using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using tiny_haven.Server.DTOs;

namespace tiny_haven.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameConfigController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public GameConfigController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet()]
        public ActionResult<GameConfigDTO> GetConfig()
        {
            var config = new GameConfigDTO
            {
                TileSize = _configuration.GetValue<int>("GameSettings:TileSize"),
                GridRows = _configuration.GetValue<int>("GameSettings:GridRows"),
                GridColumns = _configuration.GetValue<int>("GameSettings:GridColumns"),
                InventorySize = _configuration.GetValue<int>("GameSettings:InventorySize")
            };

            return Ok(config);
        }
    }
}
