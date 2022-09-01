using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Updatingto14.Models;

namespace Updatingto14.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvestedStocksController : ControllerBase
    {
        StonksDBContext context = new StonksDBContext();

        [HttpGet("GetAllInvested")]
        public List<InvestedStock> GetAllInvested(string googleId)
        {
            User user = context.Users.FirstOrDefault(u => u.GoogleId == googleId);
            return context.InvestedStocks.Include(w => w.User).Where(w => w.UserId == user.Id).ToList();
        }


        [HttpPost("PurchaseStock")]
        public InvestedStock PurchaseStock(string ticker, string googleId, float purchasePrice, int sharesPurchased)
        {
            //determines if user has already purchased stock, if so updates invested stock values, if not, adds new invested stock to table
            User user = context.Users.FirstOrDefault(u => u.GoogleId == googleId);
            if (!context.Stonks.Any(x => x.Ticker == ticker))
            {
                Stonk newStonk = new Stonk()
                {
                    Ticker = ticker,
                };
                context.Stonks.Add(newStonk);
                context.SaveChanges();
            }
            if (context.InvestedStocks.FirstOrDefault(i => i.InvestedTicker == ticker && i.UserId == user.Id) != null)
            {
                //confirms user has the cash to make purchase
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
                    user.CurrentCash -= (purchasePrice * sharesPurchased);
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
        public void SellStock(string ticker, string googleId, float sellPrice, int sharesSold)
        {
            
            User user = context.Users.FirstOrDefault(u => u.GoogleId == googleId);
            InvestedStock stock = context.InvestedStocks.FirstOrDefault(x => x.UserId == user.Id && x.InvestedTicker == ticker);
            

            //confirms user is not able to sell more share than they hold
            if (stock.SharesOwned < sharesSold)
            {
                //return null;
            }
            //removes invested stock if all shares are sold
            else if (stock.SharesOwned - sharesSold == 0)
            {
                user.CurrentCash += (sellPrice * sharesSold);
                context.InvestedStocks.Remove(stock);
                context.SaveChanges();
               //return stock;
            }
            //updates invested stock when shares are sold
            else
            {
                stock.SharesOwned -= sharesSold;
                user.CurrentCash += (sellPrice * sharesSold);
                context.SaveChanges();
                //return stock;
            }

        }



    }
}
