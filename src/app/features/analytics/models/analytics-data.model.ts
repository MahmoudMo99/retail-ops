export interface AnalyticsKpis {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
}

export interface CategoryAnalytics {
  category: string;
  revenue: number;
  products: number;
}

export interface ProductAnalytics {
  id: number;
  title: string;
  thumbnail: string;
  quantity: number;
  revenue: number;
}

export interface StatusAnalytics {
  status: string;
  count: number;
}

export interface InventoryAnalytics {
  inStock: number;
  lowStock: number;
  outOfStock: number;
}

export interface AnalyticsData {
  kpis: AnalyticsKpis;
  categories: CategoryAnalytics[];
  topProducts: ProductAnalytics[];
  orderStatuses: StatusAnalytics[];
  inventory: InventoryAnalytics;
}
