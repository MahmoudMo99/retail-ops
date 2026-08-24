import { DOCUMENT } from '@angular/common';
import { Component, effect, ElementRef, inject, input, OnDestroy, viewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ArcElement, Chart, DoughnutController, Tooltip } from 'chart.js';

import { LanguageService } from '../../../../core/services/language';
import { ThemeService } from '../../../../core/services/theme';
import { InventoryAnalytics } from '../../models/analytics-data.model';

Chart.register(DoughnutController, ArcElement, Tooltip);

@Component({
  selector: 'app-inventory-health-chart',
  imports: [],
  templateUrl: './inventory-health-chart.html',
  styleUrl: './inventory-health-chart.scss',
})
export class InventoryHealthChart implements OnDestroy {
  private readonly document = inject(DOCUMENT);

  private readonly translate = inject(TranslateService);

  private readonly themeService = inject(ThemeService);

  private readonly languageService = inject(LanguageService);

  readonly inventory = input.required<InventoryAnalytics>();

  private readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('chartCanvas');

  private chart?: Chart;

  constructor() {
    effect(() => {
      const canvas = this.canvas();
      const inventory = this.inventory();

      this.themeService.resolvedTheme();
      this.languageService.currentLanguage();

      if (!canvas) {
        return;
      }

      this.renderChart(canvas.nativeElement, inventory);
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private renderChart(canvas: HTMLCanvasElement, inventory: InventoryAnalytics): void {
    this.chart?.destroy();

    const styles = getComputedStyle(this.document.documentElement);

    this.chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: [
          this.translate.instant('ANALYTICS.INVENTORY.IN_STOCK'),
          this.translate.instant('ANALYTICS.INVENTORY.LOW_STOCK'),
          this.translate.instant('ANALYTICS.INVENTORY.OUT_OF_STOCK'),
        ],
        datasets: [
          {
            data: [inventory.inStock, inventory.lowStock, inventory.outOfStock],
            backgroundColor: [
              styles.getPropertyValue('--success').trim(),

              styles.getPropertyValue('--warning').trim(),

              styles.getPropertyValue('--danger').trim(),
            ],
            borderWidth: 0,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }
}
