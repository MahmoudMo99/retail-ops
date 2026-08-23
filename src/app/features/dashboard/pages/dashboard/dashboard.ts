import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { RevenueOverview } from '../../components/revenue-overview/revenue-overview';
import { SalesBreakdown } from '../../components/sales-breakdown/sales-breakdown';
import { RecentOrders } from "../../components/recent-orders/recent-orders";
import { TopProducts } from "../../components/top-products/top-products";

type KpiTrend = 'positive' | 'negative';
type KpiAccent = 'primary' | 'blue' | 'green' | 'orange';

interface KpiCard {
  id: string;
  title: string;
  value: string;
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
  readonly kpiCards: KpiCard[] = [
    {
      id: 'revenue',
      title: 'DASHBOARD.KPI.REVENUE',
      value: '$124,560',
      icon: 'pi pi-dollar',
      trend: 12.5,
      trendType: 'positive',
      comparison: 'DASHBOARD.KPI.VS_LAST_MONTH',
      accent: 'primary',
    },
    {
      id: 'orders',
      title: 'DASHBOARD.KPI.ORDERS',
      value: '1,482',
      icon: 'pi pi-shopping-cart',
      trend: 8.2,
      trendType: 'positive',
      comparison: 'DASHBOARD.KPI.VS_LAST_MONTH',
      accent: 'blue',
    },
    {
      id: 'customers',
      title: 'DASHBOARD.KPI.CUSTOMERS',
      value: '8,549',
      icon: 'pi pi-users',
      trend: 5.7,
      trendType: 'positive',
      comparison: 'DASHBOARD.KPI.VS_LAST_MONTH',
      accent: 'green',
    },
    {
      id: 'conversion',
      title: 'DASHBOARD.KPI.CONVERSION',
      value: '3.24%',
      icon: 'pi pi-chart-line',
      trend: 1.4,
      trendType: 'negative',
      comparison: 'DASHBOARD.KPI.VS_LAST_MONTH',
      accent: 'orange',
    },
  ];
}
