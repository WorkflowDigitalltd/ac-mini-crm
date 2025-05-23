using System;

namespace MiniCrmApi.Models
{
    public class Sale
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public Customer? Customer { get; set; }
        public int ProductId { get; set; }
        public Product? Product { get; set; }
        public DateTime SaleDate { get; set; } // Store as UTC, format as DD-MM-YYYY in UI
        public decimal AmountGBP { get; set; } // £
    }
}
