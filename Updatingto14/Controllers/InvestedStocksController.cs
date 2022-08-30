using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Updatingto14.Models;

namespace Updatingto14.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvestedStocksController : ControllerBase
    {
        StonksDBContext context = new StonksDBContext();

        [HttpPost("PurchaseStock")]
        public InvestedStock PurchaseStock(string ticker, string googleId, float purchasePrice, int sharesOwned)
        {
            //adding new invested stock to DB
            InvestedStock investedStock = new InvestedStock()
            {
                InvestedTicker = ticker,
                UserId = context.Users.FirstOrDefault(u => u.GoogleId == googleId).Id,
                PurchasePrice = purchasePrice,
                SharesOwned = sharesOwned
            };

            //determines cost of transaction, vlaidates user can purchase, updates user cash and Invested stocks table
            float cost = (float)(investedStock.SharesOwned * investedStock.PurchasePrice);
            if(cost > context.Users.FirstOrDefault(u => u.GoogleId == googleId).CurrentCash)
            {
                return null;
            } 
            else if (cost > 0 && cost <= context.Users.FirstOrDefault(u => u.GoogleId == googleId).CurrentCash)
            {
                context.Users.FirstOrDefault(u => u.GoogleId == googleId).CurrentCash -= cost;
                context.InvestedStocks.Add(investedStock);
                context.SaveChanges();
                return investedStock;
            }
            else
            {
                return null;
            }

            

        }
    }
}
