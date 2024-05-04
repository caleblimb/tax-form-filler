using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentController : ControllerBase
    {

        private readonly IMemoryCache _cache;

        public DocumentController(IMemoryCache cache)
        {
            _cache = cache;
        }

        // GET: api/document
        [HttpGet]
        public IActionResult Get()
        {
            string cacheKey = "WorkbookCache";

            Spreadsheet? spreadsheet;

            if (!_cache.TryGetValue(cacheKey, out spreadsheet))
            {
                spreadsheet = new Spreadsheet("res/testsheet.xlsx");

                _cache.Set(cacheKey, spreadsheet, TimeSpan.FromDays(1));
            }

            Sheet[] sheets = spreadsheet!.getWorkbook();
            var jsonObject = JsonConvert.SerializeObject(sheets);

            return new ContentResult
            {
                Content = jsonObject,
                ContentType = "application/json",
            };
        }
    }
}