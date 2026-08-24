import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize } from 'rxjs';

import { CategoryRevenueChart } from '../../components/category-revenue-chart/category-revenue-chart';
import { InventoryHealthChart } from '../../components/inventory-health-chart/inventory-health-chart';
import { OrderStatusChart } from '../../components/order-status-chart/order-status-chart';
import { AnalyticsData } from '../../models/analytics-data.model';
import { AnalyticsService } from '../../services/analytics';
import { FormatterService } from '../../../../core/services/formatter';

@Component({
  selector: 'app-analytics',
  imports: [TranslatePipe, CategoryRevenueChart, OrderStatusChart, InventoryHealthChart],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss',
})
export class Analytics {
  private readonly analyticsService = inject(AnalyticsService);
  readonly formatter = inject(FormatterService);

  private readonly destroyRef = inject(DestroyRef);

  readonly data = signal<AnalyticsData | null>(null);

  readonly loading = signal(false);

  readonly error = signal(false);

  readonly topCategory = computed(() => {
    return this.data()?.categories.at(0) ?? null;
  });

  readonly topProduct = computed(() => {
    return this.data()?.topProducts.at(0) ?? null;
  });

  readonly inventoryAttention = computed(() => {
    const inventory = this.data()?.inventory;

    if (!inventory) {
      return 0;
    }

    return inventory.lowStock + inventory.outOfStock;
  });

  constructor() {
    this.loadAnalytics();
  }

  getStatusKey(status: string): string {
    return `ANALYTICS.STATUS.${status.toUpperCase()}`;
  }

  private loadAnalytics(): void {
    this.loading.set(true);
    this.error.set(false);

    this.analyticsService
      .getAnalytics()
      .pipe(
        finalize(() => {
          this.loading.set(false);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (data) => {
          this.data.set(data);
        },
        error: () => {
          this.data.set(null);
          this.error.set(true);
        },
      });
  }
}
