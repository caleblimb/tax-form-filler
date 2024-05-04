using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExampleController : ControllerBase
    {
        // GET: api/your
        [HttpGet]
        public IActionResult Get()
        {
            // Retrieve data from your data source
            var data = new List<string> { "value1", "value2", "value3" };

            // Return the data as JSON
            return Ok(data);
        }

        // GET: api/your/id
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            // Retrieve data from your data source based on the ID
            var value = $"value{id}";

            // Return the data as JSON
            return Ok(value);
        }

        // POST: api/your
        [HttpPost]
        public IActionResult Post([FromBody] string value)
        {
            // Process the incoming data (e.g., save it to a database)
            // Return appropriate response
            return Ok();
        }

        // PUT: api/your/id
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] string value)
        {
            // Process the incoming data (e.g., update a resource with the given ID)
            // Return appropriate response
            return Ok();
        }

        // DELETE: api/your/id
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            // Process the deletion of a resource with the given ID
            // Return appropriate response
            return Ok();
        }
    }
}