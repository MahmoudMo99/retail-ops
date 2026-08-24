import { DOCUMENT } from '@angular/common';
import { Component, effect, ElementRef, inject, input, OnDestroy, viewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ArcElement, Chart, DoughnutController, Tooltip } from 'chart.js';

import { LanguageService } from '../../../../core/services/language';
import { ThemeService } from '../../../../core/services/theme';
import { StatusAnalytics } from '../../models/analytics-data.model';

Chart.register(DoughnutController, ArcElement, Tooltip);

@Component({
  selector: 'app-order-status-chart',
  imports: [],
  templateUrl: './order-status-chart.html',
  styleUrl: './order-status-chart.scss',
})
export class OrderStatusChart implements OnDestroy {
  private readonly document = inject(DOCUMENT);

  private readonly translate = inject(TranslateService);

  private readonly themeService = inject(ThemeService);

  private readonly languageService = inject(LanguageService);

  readonly statuses = input.required<StatusAnalytics[]>();

  private readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('chartCanvas');

  private chart?: Chart;

  constructor() {
    effect(() => {
      const canvas = this.canvas();
      const statuses = this.statuses();

      this.themeService.resolvedTheme();
      this.languageService.currentLanguage();

      if (!canvas) {
        return;
      }

      this.renderChart(canvas.nativeElement, statuses);
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private renderChart(canvas: HTMLCanvasElement, statuses: StatusAnalytics[]): void {
    this.chart?.destroy();

    const styles = getComputedStyle(this.document.documentElement);

    const colors = {
      paid: styles.getPropertyValue('--success').trim(),

      processing: styles.getPropertyValue('--info').trim(),

      pending: styles.getPropertyValue('--warning').trim(),

      cancelled: styles.getPropertyValue('--danger').trim(),
    };

    this.chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: statuses.map((item) =>
          this.translate.instant(`ANALYTICS.STATUS.${item.status.toUpperCase()}`),
        ),
        datasets: [
          {
            data: statuses.map((item) => item.count),
            backgroundColor: statuses.map((item) => colors[item.status as keyof typeof colors]),
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
