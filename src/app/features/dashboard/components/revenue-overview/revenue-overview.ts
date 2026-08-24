import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, effect, ElementRef, inject, viewChild } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import {
  CategoryScale,
  Chart,
  Filler,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';

import { FormatterService } from '../../../../core/services/formatter';
import { AppLanguage, LanguageService } from '../../../../core/services/language';
import { ResolvedTheme, ThemeService } from '../../../../core/services/theme';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Tooltip,
  Filler,
);

@Component({
  selector: 'app-revenue-overview',
  imports: [TranslatePipe],
  templateUrl: './revenue-overview.html',
  styleUrl: './revenue-overview.scss',
})
export class RevenueOverview {
  private readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('chartCanvas');

  private readonly themeService = inject(ThemeService);

  private readonly languageService = inject(LanguageService);

  private readonly document = inject(DOCUMENT);

  private readonly destroyRef = inject(DestroyRef);

  readonly formatter = inject(FormatterService);

  readonly totalRevenue = 124560;

  readonly revenueGrowth = 0.125;

  private chart?: Chart<'line'>;

  constructor() {
    effect(() => {
      const canvas = this.canvas();

      const theme = this.themeService.resolvedTheme();

      const language = this.languageService.currentLanguage();

      if (!canvas) {
        return;
      }

      this.chart?.destroy();

      this.chart = this.createChart(canvas.nativeElement, theme, language);
    });

    this.destroyRef.onDestroy(() => {
      this.chart?.destroy();
    });
  }

  private createChart(
    canvas: HTMLCanvasElement,
    theme: ResolvedTheme,
    language: AppLanguage,
  ): Chart<'line'> {
    const styles = this.document.defaultView!.getComputedStyle(this.document.documentElement);

    const primary = styles.getPropertyValue('--primary').trim();

    const textMuted = styles.getPropertyValue('--text-muted').trim();

    const border = styles.getPropertyValue('--border-primary').trim();

    const surface = styles.getPropertyValue('--surface-primary').trim();

    const chartFill = styles.getPropertyValue('--chart-primary-soft').trim();

    const fontFamily = styles
      .getPropertyValue(language === 'ar' ? '--font-ar' : '--font-en')
      .trim();

    return new Chart(canvas, {
      type: 'line',

      data: {
        labels: this.createLabels(),

        datasets: [
          {
            data: [12400, 15800, 14300, 18900, 17600, 21800, 24600],
            borderColor: primary,
            backgroundColor: chartFill,
            borderWidth: 2.5,
            tension: 0.4,
            fill: true,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBorderWidth: 3,
            pointBackgroundColor: primary,
            pointBorderColor: surface,
          },
        ],
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,

        interaction: {
          intersect: false,
          mode: 'index',
        },

        plugins: {
          legend: {
            display: false,
          },

          tooltip: {
            displayColors: false,

            rtl: language === 'ar',

            textDirection: language === 'ar' ? 'rtl' : 'ltr',

            backgroundColor: theme === 'dark' ? '#252a35' : '#101828',

            titleColor: '#ffffff',

            bodyColor: '#ffffff',

            padding: 12,

            cornerRadius: 8,

            titleFont: {
              family: fontFamily,
              size: 11,
              weight: 500,
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
            border: {
              display: false,
            },

            grid: {
              display: false,
            },

            ticks: {
              color: textMuted,

              font: {
                family: fontFamily,
                size: 11,
              },
            },
          },

          y: {
            beginAtZero: true,

            border: {
              display: false,
            },

            grid: {
              color: border,
            },

            ticks: {
              color: textMuted,

              padding: 8,

              font: {
                family: fontFamily,
                size: 11,
              },

              callback: (value) => this.formatter.formatCompactNumber(Number(value), 0),
            },
          },
        },
      },
    });
  }

  private createLabels(): string[] {
    const today = new Date();

    return Array.from(
      {
        length: 7,
      },
      (_, index) => {
        const date = new Date(today);

        date.setDate(today.getDate() - (6 - index) * 5);

        return this.formatter.formatShortDate(date);
      },
    );
  }
}
