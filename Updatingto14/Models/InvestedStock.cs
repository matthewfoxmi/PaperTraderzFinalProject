using System;
using System.Collections.Generic;

namespace Updatingto14.Models
{
    public partial class InvestedStock
    {
        public int Id { get; set; }
        public string? InvestedTicker { get; set; }
        public float? PurchasePrice { get; set; }
        public int? UserId { get; set; }
        public int? SharesOwned { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public virtual Stonk? InvestedTickerNavigation { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public virtual User? User { get; set; }
    }
}
