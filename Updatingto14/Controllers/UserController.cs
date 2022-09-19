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
            return context.Users.ToList();
        }

        [HttpGet("getUserByGoogleId/{GoogleId}")]
        public User getUserByGoogleId(string googleId)
        {
            return context.Users.FirstOrDefault(g => g.GoogleId == googleId);
        }

        [HttpPost("createNewUser")]
        public User createNewUser(string googleId, string profileName)
        {
            if(context.Users.Any(g => g.GoogleId == googleId))
            {
                return null;
            }
            else
            {
                User newUser = new User()
                {
                    ProfileName = profileName,
                    UserIcon = "https://lh3.googleusercontent.com/pw/AL9nZEVzkjXt1wEpNJXB1A-7Dc-dMDYKhg3_2KgLKcn1m2fVk4-NRX1lEfpAdPsKjnkT2hd2CTx4e9GgMd7Vv6tIIlRCs-7nsQyeJbRW_ZwWJYWyEf3ja7MpAmwx3uKbBP6eUr75UyfWB2mqDPYMQSDbYVnb=s512-no?authuser=0",
                    CurrentCash = 10000,
                    PortfolioTotalValue = 10000,
                    GoogleId = googleId
                };
                context.Users.Add(newUser);
                context.SaveChanges();
                return newUser;
            }
        }
        [HttpPatch("editProfile")]
        public User editProfile(string profileName, string googleId)
        {            
            if (context.Users.Any(p => p.ProfileName == profileName))
            {
                return null;
            }
            else
            {
                User user = context.Users.FirstOrDefault(g => g.GoogleId == googleId);
                user.ProfileName = profileName;
                context.Users.Update(user);
                context.SaveChanges();
                return user;
            }            
        }

        [HttpPatch("editProfilePicture")]
        public User editProfilePicture(string profilePictureUrl, string googleId)
        {            
            User user = context.Users.FirstOrDefault(g => g.GoogleId == googleId);
            user.UserIcon = profilePictureUrl;
            context.Users.Update(user);
            context.SaveChanges();
            return user;            
        }

    }
}
