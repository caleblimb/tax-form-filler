using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentController : ControllerBase
    {

        private readonly IMemoryCache _cache;
        private readonly IWebHostEnvironment _env;

        public DocumentController(IWebHostEnvironment env, IMemoryCache cache)
        {
            _env = env;
            _cache = cache;

        }

        // GET: api/document
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            string cacheKey = "document";


            if (!_cache.TryGetValue(cacheKey, out string? document))
            {

                var filePath = Path.Combine(_env.ContentRootPath, "Data", "data.json");
                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound();
                }

                document = await System.IO.File.ReadAllTextAsync(filePath);

                _cache.Set(cacheKey, document, TimeSpan.FromDays(1));
            }

            return new ContentResult
            {
                Content = document!,
                ContentType = "application/json",
            };
        }
    }
}