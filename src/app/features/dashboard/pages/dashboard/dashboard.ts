import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { FormatterService } from '../../../../core/services/formatter';
import { RecentOrders } from '../../components/recent-orders/recent-orders';
import { RevenueOverview } from '../../components/revenue-overview/revenue-overview';
import { SalesBreakdown } from '../../components/sales-breakdown/sales-breakdown';
import { TopProducts } from '../../components/top-products/top-products';

type KpiTrend = 'positive' | 'negative';

type KpiAccent = 'primary' | 'blue' | 'green' | 'orange';

type KpiValueType = 'currency' | 'number' | 'percent';

interface KpiCard {
  id: string;
  title: string;
  value: number;
  valueType: KpiValueType;
  icon: string;
  trend: number;
  trendType: KpiTrend;
  comparison: string;
  accent: KpiAccent;
}

@Component({
  selector: 'app-dashboard',
  imports: [TranslatePipe, RevenueOverview, SalesBreakdown, RecentOrders, TopProducts],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  readonly formatter = inject(FormatterService);

  readonly kpiCards: KpiCard[] = [
    {
      id: 'revenue',
      title: 'DASHBOARD.KPI.REVENUE',
      value: 124560,
      valueType: 'currency',
      icon: 'pi pi-dollar',
      trend: 12.5,
      trendType: 'positive',
      comparison: 'DASHBOARD.KPI.VS_LAST_MONTH',
      accent: 'primary',
    },
    {
      id: 'orders',
      title: 'DASHBOARD.KPI.ORDERS',
      value: 1482,
      valueType: 'number',
      icon: 'pi pi-shopping-cart',
      trend: 8.2,
      trendType: 'positive',
      comparison: 'DASHBOARD.KPI.VS_LAST_MONTH',
      accent: 'blue',
    },
    {
      id: 'customers',
      title: 'DASHBOARD.KPI.CUSTOMERS',
      value: 8549,
      valueType: 'number',
      icon: 'pi pi-users',
      trend: 5.7,
      trendType: 'positive',
      comparison: 'DASHBOARD.KPI.VS_LAST_MONTH',
      accent: 'green',
    },
    {
      id: 'conversion',
      title: 'DASHBOARD.KPI.CONVERSION',
      value: 0.0324,
      valueType: 'percent',
      icon: 'pi pi-chart-line',
      trend: 1.4,
      trendType: 'negative',
      comparison: 'DASHBOARD.KPI.VS_LAST_MONTH',
      accent: 'orange',
    },
  ];

  formatKpiValue(card: KpiCard): string {
    switch (card.valueType) {
      case 'currency':
        return this.formatter.formatCurrency(card.value, 'USD', 0, 0);

      case 'percent':
        return this.formatter.formatPercent(card.value, 2);

      default:
        return this.formatter.formatNumber(card.value);
    }
  }

  formatTrend(trend: number): string {
    return this.formatter.formatPercent(trend / 100, 1);
  }
}
