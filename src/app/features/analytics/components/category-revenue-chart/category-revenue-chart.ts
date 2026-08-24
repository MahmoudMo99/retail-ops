import { DOCUMENT } from '@angular/common';
import { Component, effect, ElementRef, inject, input, OnDestroy, viewChild } from '@angular/core';
import { BarController, BarElement, CategoryScale, Chart, LinearScale, Tooltip } from 'chart.js';

import { LanguageService } from '../../../../core/services/language';
import { ThemeService } from '../../../../core/services/theme';
import { CategoryAnalytics } from '../../models/analytics-data.model';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

@Component({
  selector: 'app-category-revenue-chart',
  imports: [],
  templateUrl: './category-revenue-chart.html',
  styleUrl: './category-revenue-chart.scss',
})
export class CategoryRevenueChart implements OnDestroy {
  private readonly document = inject(DOCUMENT);

  private readonly themeService = inject(ThemeService);

  private readonly languageService = inject(LanguageService);

  readonly categories = input.required<CategoryAnalytics[]>();

  private readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('chartCanvas');

  private chart?: Chart;

  constructor() {
    effect(() => {
      const canvas = this.canvas();
      const categories = this.categories();

      this.themeService.resolvedTheme();
      this.languageService.currentLanguage();

      if (!canvas) {
        return;
      }

      this.renderChart(canvas.nativeElement, categories);
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private renderChart(canvas: HTMLCanvasElement, categories: CategoryAnalytics[]): void {
    this.chart?.destroy();

    const styles = getComputedStyle(this.document.documentElement);

    const primary = styles.getPropertyValue('--primary').trim();

    const textSecondary = styles.getPropertyValue('--text-secondary').trim();

    const border = styles.getPropertyValue('--border-primary').trim();

    const topCategories = categories.slice(0, 7);

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: topCategories.map((item) => item.category),
        datasets: [
          {
            data: topCategories.map((item) => item.revenue),
            backgroundColor: primary,
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) =>
                new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(Number(context.raw)),
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              color: border,
            },
            ticks: {
              color: textSecondary,
              callback: (value) => `$${Number(value).toLocaleString()}`,
            },
            border: {
              display: false,
            },
          },
          y: {
            grid: {
              display: false,
            },
            ticks: {
              color: textSecondary,
            },
            border: {
              display: false,
            },
          },
        },
      },
    });
  }
}
