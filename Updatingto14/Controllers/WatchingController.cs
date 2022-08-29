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
        public List<WatchingStock> ShowWatchingStocks(string googleId)
        {
            int UserId = context.Users.FirstOrDefault(u => u.GoogleId == googleId).Id;
            return context.WatchingStocks.Where(x => x.UserId == UserId).OrderBy(x => x.WatchingTicker).ToList();
        }

        [HttpPost("AddWatchingStock")]
        public WatchingStock AddWatchingStock(string ticker, string googleId)
        {
            WatchingStock watchStock = new WatchingStock()
            {
                WatchingTicker = ticker,
                UserId = context.Users.FirstOrDefault(u => u.GoogleId == googleId).Id
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
