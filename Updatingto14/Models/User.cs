using System;
using System.Collections.Generic;

namespace Updatingto14.Models
{
    public partial class User
    {
        public int Id { get; set; }
        public string? ProfileName { get; set; }
        public string? UserIcon { get; set; }
        public float? CurrentCash { get; set; }
        public float? PortfolioTotalValue { get; set; }
        public string? GoogleId { get; set; }
    }
}
