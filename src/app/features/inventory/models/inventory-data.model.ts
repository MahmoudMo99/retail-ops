import { InventoryItem } from './inventory-item.model';
import { InventorySummary } from './inventory-summary.model';

export interface InventoryData {
  items: InventoryItem[];
  summary: InventorySummary;
}
