export type InventoryStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export interface InventoryItem {
  id: number;
  title: string;
  sku: string;
  category: string;
  brand?: string;
  price: number;
  stock: number;
  thumbnail: string;
  status: InventoryStatus;
}
