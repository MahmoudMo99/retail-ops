import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, effect, ElementRef, inject, viewChild } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ArcElement, Chart, DoughnutController, Tooltip } from 'chart.js';

import { AppLanguage, LanguageService } from '../../../../core/services/language';
import { ThemeService } from '../../../../core/services/theme';

Chart.register(ArcElement, DoughnutController, Tooltip);

interface SalesCategory {
  label: string;
  value: number;
  token: string;
}

@Component({
  selector: 'app-sales-breakdown',
  imports: [TranslatePipe],
  templateUrl: './sales-breakdown.html',
  styleUrl: './sales-breakdown.scss',
})
export class SalesBreakdown {
  private readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('chartCanvas');

  private readonly themeService = inject(ThemeService);
  private readonly languageService = inject(LanguageService);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  private chart?: Chart<'doughnut'>;

  readonly categories: SalesCategory[] = [
    {
      label: 'DASHBOARD.SALES.ELECTRONICS',
      value: 38,
      token: '--primary',
    },
    {
      label: 'DASHBOARD.SALES.FASHION',
      value: 27,
      token: '--info',
    },
    {
      label: 'DASHBOARD.SALES.HOME',
      value: 21,
      token: '--success',
    },
    {
      label: 'DASHBOARD.SALES.BEAUTY',
      value: 14,
      token: '--warning',
    },
  ];

  constructor() {
    effect(() => {
      const canvas = this.canvas();
      this.themeService.resolvedTheme();
      const language = this.languageService.currentLanguage();

      if (!canvas) {
        return;
      }

      this.chart?.destroy();

      this.chart = this.createChart(canvas.nativeElement, language);
    });

    this.destroyRef.onDestroy(() => {
      this.chart?.destroy();
    });
  }

  getCategoryColor(token: string): string {
    const styles = this.document.defaultView!.getComputedStyle(this.document.documentElement);

    return styles.getPropertyValue(token).trim();
  }

  private createChart(canvas: HTMLCanvasElement, language: AppLanguage): Chart<'doughnut'> {
    const styles = this.document.defaultView!.getComputedStyle(this.document.documentElement);

    const surface = styles.getPropertyValue('--surface-primary').trim();
    const fontFamily = styles
      .getPropertyValue(language === 'ar' ? '--font-ar' : '--font-en')
      .trim();

    const colors = this.categories.map((category) =>
      styles.getPropertyValue(category.token).trim(),
    );

    return new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: this.categories.map((category) => category.label),
        datasets: [
          {
            data: this.categories.map((category) => category.value),
            backgroundColor: colors,
            borderColor: surface,
            borderWidth: 4,
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
          tooltip: {
            displayColors: false,
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
              label: (context) => `${context.formattedValue}%`,
            },
          },
        },
      },
    });
  }
}
