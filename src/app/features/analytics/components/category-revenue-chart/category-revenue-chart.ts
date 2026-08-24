import { DOCUMENT } from '@angular/common';
import { Component, effect, ElementRef, inject, input, OnDestroy, viewChild } from '@angular/core';
import { BarController, BarElement, CategoryScale, Chart, LinearScale, Tooltip } from 'chart.js';

import { FormatterService } from '../../../../core/services/formatter';
import { AppLanguage, LanguageService } from '../../../../core/services/language';
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

  private readonly formatter = inject(FormatterService);

  readonly categories = input.required<CategoryAnalytics[]>();

  private readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('chartCanvas');

  private chart?: Chart<'bar'>;

  constructor() {
    effect(() => {
      const canvas = this.canvas();

      const categories = this.categories();

      this.themeService.resolvedTheme();

      const language = this.languageService.currentLanguage();

      if (!canvas) {
        return;
      }

      this.renderChart(canvas.nativeElement, categories, language);
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private renderChart(
    canvas: HTMLCanvasElement,
    categories: CategoryAnalytics[],
    language: AppLanguage,
  ): void {
    this.chart?.destroy();

    const styles = this.document.defaultView!.getComputedStyle(this.document.documentElement);

    const primary = styles.getPropertyValue('--primary').trim();

    const textSecondary = styles.getPropertyValue('--text-secondary').trim();

    const border = styles.getPropertyValue('--border-primary').trim();

    const fontFamily = styles
      .getPropertyValue(language === 'ar' ? '--font-ar' : '--font-en')
      .trim();

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
            displayColors: false,

            rtl: language === 'ar',

            textDirection: language === 'ar' ? 'rtl' : 'ltr',

            padding: 11,

            cornerRadius: 8,

            titleFont: {
              family: fontFamily,
              size: 11,
            },

            bodyFont: {
              family: fontFamily,
              size: 12,
              weight: 600,
            },

            callbacks: {
              label: (context) => this.formatter.formatCurrency(Number(context.raw), 'USD', 0, 0),
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

              font: {
                family: fontFamily,
                size: 10,
              },

              callback: (value) => this.formatter.formatCompactCurrency(Number(value), 'USD', 1),
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

              font: {
                family: fontFamily,
                size: 10,
              },
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
