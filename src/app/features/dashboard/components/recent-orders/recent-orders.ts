import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

type OrderStatus = 'paid' | 'pending' | 'processing' | 'refunded';

interface RecentOrder {
  id: string;
  customer: string;
  initials: string;
  amount: number;
  status: OrderStatus;
  date: string;
}

@Component({
  selector: 'app-recent-orders',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './recent-orders.html',
  styleUrl: './recent-orders.scss',
})
export class RecentOrders {
  readonly orders: RecentOrder[] = [
    {
      id: '#ORD-1048',
      customer: 'Ahmed Hassan',
      initials: 'AH',
      amount: 320,
      status: 'paid',
      date: 'Aug 22',
    },
    {
      id: '#ORD-1047',
      customer: 'Sara Mohamed',
      initials: 'SM',
      amount: 185,
      status: 'pending',
      date: 'Aug 22',
    },
    {
      id: '#ORD-1046',
      customer: 'Omar Ali',
      initials: 'OA',
      amount: 540,
      status: 'processing',
      date: 'Aug 21',
    },
    {
      id: '#ORD-1045',
      customer: 'Nour Ahmed',
      initials: 'NA',
      amount: 96,
      status: 'refunded',
      date: 'Aug 21',
    },
    {
      id: '#ORD-1044',
      customer: 'Youssef Adel',
      initials: 'YA',
      amount: 410,
      status: 'paid',
      date: 'Aug 20',
    },
  ];

  getStatusKey(status: OrderStatus): string {
    return `DASHBOARD.ORDERS.STATUS.${status.toUpperCase()}`;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  }
}
