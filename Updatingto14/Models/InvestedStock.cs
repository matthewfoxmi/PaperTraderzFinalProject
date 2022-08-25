using System;
using System.Collections.Generic;

namespace Updatingto14.Models
{
    public partial class InvestedStock
    {
        public string? InvestedTicker { get; set; }
        public float? PurchasePrice { get; set; }
        public int? UserId { get; set; }
        public int? SharesOwned { get; set; }

        public virtual Stonk? InvestedTickerNavigation { get; set; }
        public virtual User? User { get; set; }
    }
}
