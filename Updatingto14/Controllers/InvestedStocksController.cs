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
        public InvestedStock PurchaseStock(string ticker, string googleId, float purchasePrice, int sharesPurchased)
        {

            User user = context.Users.FirstOrDefault(u => u.GoogleId == googleId);
            if (context.InvestedStocks.FirstOrDefault(i => i.InvestedTicker == ticker && i.UserId == user.Id) != null)
            {
                if (purchasePrice * sharesPurchased > context.Users.FirstOrDefault(u => u.GoogleId == googleId).CurrentCash)
                {
                    return null;
                }
                else if (purchasePrice * sharesPurchased > 0 && purchasePrice * sharesPurchased <= context.Users.FirstOrDefault(u => u.GoogleId == googleId).CurrentCash)
                {
                    InvestedStock invested = context.InvestedStocks.FirstOrDefault(i => i.InvestedTicker == ticker && i.UserId == user.Id);
                    invested.SharesOwned += sharesPurchased;
                    //owned shares multiplied by price they were bought for, to give the total investment, and new shares buying multiplied by the new price
                    //adds those together, divided by the total amount of shares owned now.
                    invested.PurchasePrice = ((invested.PurchasePrice * invested.SharesOwned) + (sharesPurchased * purchasePrice)) / (invested.SharesOwned + sharesPurchased);
                    context.InvestedStocks.Update(invested);
                    context.SaveChanges();
                    return invested;
                }
                else
                {
                    return null;
                }
            }
            else
            {
                //adding new invested stock to DB
                InvestedStock investedStock = new InvestedStock()
                {
                    InvestedTicker = ticker,
                    UserId = context.Users.FirstOrDefault(u => u.GoogleId == googleId).Id,
                    PurchasePrice = purchasePrice,
                    SharesOwned = sharesPurchased
                };
                float cost = (float)(investedStock.SharesOwned * investedStock.PurchasePrice);
                //determines cost of transaction, vlaidates user can purchase, updates user cash and Invested stocks table
                if (cost > context.Users.FirstOrDefault(u => u.GoogleId == googleId).CurrentCash)
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
        [HttpPatch("SellStock")]
        public InvestedStock SellStock(string ticker, string googleId, float purchasePrice, int sharesOwned)
        {
            User user = context.Users.FirstOrDefault(u => u.GoogleId == googleId);
            InvestedStock stock = context.InvestedStocks.FirstOrDefault(x => x.UserId == user.Id && x.InvestedTicker == ticker);
            if (stock.SharesOwned < sharesOwned)
            {
                return null;
            }
            else
            {
                stock.SharesOwned -= sharesOwned;
                user.CurrentCash += purchasePrice * sharesOwned;
                context.SaveChanges();
                return stock;
            }

        }



    }
}
