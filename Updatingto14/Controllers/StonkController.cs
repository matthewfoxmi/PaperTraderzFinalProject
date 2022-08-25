using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Updatingto14.Models;

namespace Updatingto14.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StonkController : ControllerBase
    {
        StonksDBContext context = new StonksDBContext();


        [HttpGet("getAllStonks")]
        public List<Stonk> getAllStonks()
        {
            return context.Stonks.ToList();
        }

        [HttpGet("getStonkByTicker/{ticker}")]
        public Stonk getStonkByTicket(string ticker)
        {
            return context.Stonks.FirstOrDefault(t => t.Ticker.ToUpper() == ticker.ToUpper());
        }



    }
}
