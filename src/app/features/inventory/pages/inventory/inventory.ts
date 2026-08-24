import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { SortIcon, TableModule } from 'primeng/table';
import { finalize } from 'rxjs';

import { FormatterService } from '../../../../core/services/formatter';
import { InventoryItem, InventoryStatus } from '../../models/inventory-item.model';
import { InventorySummary } from '../../models/inventory-summary.model';
import { InventoryService } from '../../services/inventory';

type StockAdjustmentMode = 'add' | 'remove' | 'set';

@Component({
  selector: 'app-inventory',
  imports: [TableModule, SortIcon, DialogModule, TranslatePipe],
  templateUrl: './inventory.html',
  styleUrl: './inventory.scss',
})
export class Inventory {
  private readonly inventoryService = inject(InventoryService);

  private readonly destroyRef = inject(DestroyRef);
  readonly formatter = inject(FormatterService);

  readonly items = signal<InventoryItem[]>([]);

  readonly summary = signal<InventorySummary | null>(null);

  readonly loading = signal(false);
  readonly error = signal(false);

  readonly searchTerm = signal('');

  readonly selectedStatus = signal<InventoryStatus | 'all'>('all');

  readonly selectedCategory = signal('all');

  readonly selectedItem = signal<InventoryItem | null>(null);

  readonly adjustVisible = signal(false);
  readonly adjusting = signal(false);

  readonly adjustmentMode = signal<StockAdjustmentMode>('add');

  readonly adjustmentQuantity = signal(1);

  readonly categories = computed(() => {
    return [...new Set(this.items().map((item) => item.category))].sort();
  });

  readonly filteredItems = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();

    const status = this.selectedStatus();

    const category = this.selectedCategory();

    return this.items().filter((item) => {
      const matchesSearch =
        !search ||
        item.title.toLowerCase().includes(search) ||
        item.sku.toLowerCase().includes(search) ||
        item.brand?.toLowerCase().includes(search);

      const matchesStatus = status === 'all' || item.status === status;

      const matchesCategory = category === 'all' || item.category === category;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  });

  readonly hasActiveFilters = computed(() => {
    return (
      !!this.searchTerm().trim() ||
      this.selectedStatus() !== 'all' ||
      this.selectedCategory() !== 'all'
    );
  });

  readonly adjustedStock = computed(() => {
    const item = this.selectedItem();

    if (!item) {
      return 0;
    }

    const quantity = this.adjustmentQuantity();

    switch (this.adjustmentMode()) {
      case 'add':
        return item.stock + quantity;

      case 'remove':
        return item.stock - quantity;

      case 'set':
        return quantity;
    }
  });

  readonly adjustmentInvalid = computed(() => {
    const item = this.selectedItem();
    const quantity = this.adjustmentQuantity();

    if (!item) {
      return true;
    }

    if (!Number.isInteger(quantity) || quantity < 0) {
      return true;
    }

    if (this.adjustmentMode() !== 'set' && quantity === 0) {
      return true;
    }

    return this.adjustedStock() < 0;
  });

  constructor() {
    this.loadInventory();
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.searchTerm.set(value);
  }

  onStatusChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as InventoryStatus | 'all';

    this.selectedStatus.set(value);
  }

  onCategoryChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;

    this.selectedCategory.set(value);
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedStatus.set('all');
    this.selectedCategory.set('all');
  }

  openAdjustStock(item: InventoryItem): void {
    this.selectedItem.set(item);
    this.adjustmentMode.set('add');
    this.adjustmentQuantity.set(1);
    this.adjustVisible.set(true);
  }

  closeAdjustStock(): void {
    if (this.adjusting()) {
      return;
    }

    this.adjustVisible.set(false);
    this.selectedItem.set(null);
  }

  setAdjustmentMode(mode: StockAdjustmentMode): void {
    this.adjustmentMode.set(mode);

    if (mode === 'set') {
      this.adjustmentQuantity.set(this.selectedItem()?.stock ?? 0);

      return;
    }

    this.adjustmentQuantity.set(1);
  }

  onAdjustmentQuantity(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);

    this.adjustmentQuantity.set(value);
  }

  saveStockAdjustment(): void {
    const item = this.selectedItem();

    if (!item || this.adjustmentInvalid()) {
      return;
    }

    const stock = this.adjustedStock();

    this.adjusting.set(true);

    this.inventoryService
      .updateStock(item.id, stock)
      .pipe(
        finalize(() => {
          this.adjusting.set(false);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (updatedProduct) => {
          const updatedItems = this.items().map((inventoryItem) =>
            inventoryItem.id === item.id
              ? {
                  ...inventoryItem,
                  stock: updatedProduct.stock,
                  status: this.resolveStockStatus(updatedProduct.stock),
                }
              : inventoryItem,
          );

          this.items.set(updatedItems);

          this.summary.set(this.calculateSummary(updatedItems));

          this.adjustVisible.set(false);
          this.selectedItem.set(null);
        },
      });
  }

  getStatusKey(status: InventoryStatus): string {
    const statusKey = {
      'in-stock': 'IN_STOCK',
      'low-stock': 'LOW_STOCK',
      'out-of-stock': 'OUT_OF_STOCK',
    };

    return `INVENTORY.STATUS.${statusKey[status]}`;
  }

  getStockLevel(stock: number): number {
    return Math.min(Math.max(stock, 0), 100);
  }

  private resolveStockStatus(stock: number): InventoryStatus {
    if (stock === 0) {
      return 'out-of-stock';
    }

    if (stock <= 10) {
      return 'low-stock';
    }

    return 'in-stock';
  }

  private calculateSummary(items: InventoryItem[]): InventorySummary {
    return {
      totalProducts: items.length,

      totalUnits: items.reduce((total, item) => total + item.stock, 0),

      inStock: items.filter((item) => item.status === 'in-stock').length,

      lowStock: items.filter((item) => item.status === 'low-stock').length,

      outOfStock: items.filter((item) => item.status === 'out-of-stock').length,

      inventoryValue: items.reduce((total, item) => total + item.stock * item.price, 0),
    };
  }

  private loadInventory(): void {
    this.loading.set(true);
    this.error.set(false);

    this.inventoryService
      .getInventory()
      .pipe(
        finalize(() => {
          this.loading.set(false);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (data) => {
          this.items.set(data.items);
          this.summary.set(data.summary);
        },
        error: () => {
          this.items.set([]);
          this.summary.set(null);
          this.error.set(true);
        },
      });
  }
}
