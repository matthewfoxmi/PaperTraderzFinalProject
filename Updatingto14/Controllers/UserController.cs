using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Updatingto14.Models;

namespace Updatingto14.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        StonksDBContext context = new StonksDBContext();

        [HttpGet("getAllUsers")]
        public List<User> getAllUsers()
        {
            return context.Users.OrderByDescending(x => x.PortfolioTotalValue).ToList();
        }

        [HttpGet("getUserByGoogleId/{GoogleId}")]
        public User getUserByGoogleId(string googleId)
        {
            return context.Users.FirstOrDefault(g => g.GoogleId == googleId);
        }

        [HttpPost("createNewUser")]
        public User createNewUser(string googleId)
        {
            if(context.Users.Any(g => g.GoogleId == googleId))
            {
                return null;
            }
            else
            {
                User newUser = new User()
                {
                    ProfileName = "",
                    UserIcon = null,
                    CurrentCash = 10000,
                    PortfolioTotalValue = 10000,
                    GoogleId = googleId
                };
                context.Users.Add(newUser);
                context.SaveChanges();
                return newUser;
            }
        }
    }
}
