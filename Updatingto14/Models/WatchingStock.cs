using System;
using System.Collections.Generic;

namespace Updatingto14.Models
{
    public partial class WatchingStock
    {
        public int Id { get; set; }
        public string? WatchingTicker { get; set; }
        public int? UserId { get; set; }

        public virtual User? User { get; set; }
        public virtual Stonk? WatchingTickerNavigation { get; set; }
    }
}
