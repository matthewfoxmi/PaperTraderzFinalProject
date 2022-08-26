using System;
using System.Collections.Generic;

namespace Updatingto14.Models
{
    public partial class User
    {
        public User()
        {
            InvestedStocks = new HashSet<InvestedStock>();
            WatchingStocks = new HashSet<WatchingStock>();
        }

        public int Id { get; set; }
        public string? ProfileName { get; set; }
        public string? UserIcon { get; set; }
        public float? CurrentCash { get; set; }
        public float? PortfolioTotalValue { get; set; }
        public string? GoogleId { get; set; }

        public virtual ICollection<InvestedStock> InvestedStocks { get; set; }
        public virtual ICollection<WatchingStock> WatchingStocks { get; set; }
    }
}
