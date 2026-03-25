// Interface for total sales
export interface ITotalSale {
  date: string;
  totalGrandPrice: number;
}
// Interface for total purchases
export interface ITotalPurchase {
  date: string;
  totalNetPrice: number;
}

// Aggregated profit interface that uses the separate interfaces
export interface IAggregatedProfit {
  totalSales: ITotalSale[];
  totalPurchases: ITotalPurchase[];
  profit: number;
}
