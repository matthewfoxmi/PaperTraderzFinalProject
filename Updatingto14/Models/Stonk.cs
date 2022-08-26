using System;
using System.Collections.Generic;

namespace Updatingto14.Models
{
    public partial class Stonk
    {
        public Stonk()
        {
            InvestedStocks = new HashSet<InvestedStock>();
            WatchingStocks = new HashSet<WatchingStock>();
        }

        public string Ticker { get; set; } = null!;

        public virtual ICollection<InvestedStock> InvestedStocks { get; set; }
        public virtual ICollection<WatchingStock> WatchingStocks { get; set; }
    }
}
