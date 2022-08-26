using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Updatingto14.Models;

namespace Updatingto14.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WatchingController : ControllerBase
    {
        StonksDBContext context = new StonksDBContext();

        [HttpGet("ShowWatchingStocks")]
        public List<WatchingStock> ShowWatchingStocks(int userId)
        {
            return context.WatchingStocks.Where(x => x.UserId == userId).OrderBy(x => x.WatchingTicker).ToList();
        }

        [HttpPost("AddWatchingStock")]
        public WatchingStock AddWatchingStock(string ticker, int userId)
        {
            WatchingStock watchStock = new WatchingStock()
            {
                WatchingTicker = ticker,
                UserId = userId
            };
            context.WatchingStocks.Add(watchStock);
            context.SaveChanges();
            return watchStock;
        }

        [HttpDelete("RemoveWatchingStock")]
        public WatchingStock RemoveWatchingStock(string ticker, int userId)
        {
            WatchingStock watchStock = context.WatchingStocks.FirstOrDefault(w => w.WatchingTicker == ticker && w.UserId == userId);
            context.WatchingStocks.Remove(watchStock);
            context.SaveChanges();
            return watchStock;
        }
    }
}
