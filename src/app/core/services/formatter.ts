import { inject, Injectable } from '@angular/core';

import { LanguageService } from './language';

@Injectable({
  providedIn: 'root',
})
export class FormatterService {
  private readonly languageService = inject(LanguageService);

  formatCurrency(
    value: number,
    currency = 'USD',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  ): string {
    if (!Number.isFinite(value)) {
      return '—';
    }

    return new Intl.NumberFormat(this.locale, {
      style: 'currency',
      currency,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(value);
  }

  formatCompactCurrency(value: number, currency = 'USD', maximumFractionDigits = 1): string {
    if (!Number.isFinite(value)) {
      return '—';
    }

    return new Intl.NumberFormat(this.locale, {
      style: 'currency',
      currency,
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits,
    }).format(value);
  }

  formatNumber(value: number, minimumFractionDigits = 0, maximumFractionDigits = 0): string {
    if (!Number.isFinite(value)) {
      return '—';
    }

    return new Intl.NumberFormat(this.locale, {
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(value);
  }

  formatCompactNumber(value: number, maximumFractionDigits = 1): string {
    if (!Number.isFinite(value)) {
      return '—';
    }

    return new Intl.NumberFormat(this.locale, {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits,
    }).format(value);
  }

  formatPercent(value: number, maximumFractionDigits = 1): string {
    if (!Number.isFinite(value)) {
      return '—';
    }

    return new Intl.NumberFormat(this.locale, {
      style: 'percent',
      maximumFractionDigits,
    }).format(value);
  }

  formatDate(value: string | number | Date): string {
    const date = this.parseDate(value);

    if (!date) {
      return '—';
    }

    return new Intl.DateTimeFormat(this.locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  }

  formatShortDate(value: string | number | Date): string {
    const date = this.parseDate(value);

    if (!date) {
      return '—';
    }

    return new Intl.DateTimeFormat(this.locale, {
      day: 'numeric',
      month: 'short',
    }).format(date);
  }

  formatDateTime(value: string | number | Date): string {
    const date = this.parseDate(value);

    if (!date) {
      return '—';
    }

    return new Intl.DateTimeFormat(this.locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  }

  private get locale(): string {
    return this.languageService.currentLanguage() === 'ar' ? 'ar-EG' : 'en-US';
  }

  private parseDate(value: string | number | Date): Date | null {
    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return date;
  }
}
