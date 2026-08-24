import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { FormatterService } from '../../../../core/services/formatter';

type OrderStatus = 'paid' | 'pending' | 'processing' | 'refunded';

interface RecentOrder {
  id: string;
  customer: string;
  initials: string;
  amount: number;
  status: OrderStatus;
  date: Date;
}

@Component({
  selector: 'app-recent-orders',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './recent-orders.html',
  styleUrl: './recent-orders.scss',
})
export class RecentOrders {
  readonly formatter = inject(FormatterService);

  readonly orders: RecentOrder[] = [
    {
      id: '#ORD-1048',
      customer: 'Ahmed Hassan',
      initials: 'AH',
      amount: 320,
      status: 'paid',
      date: new Date(2026, 7, 22),
    },
    {
      id: '#ORD-1047',
      customer: 'Sara Mohamed',
      initials: 'SM',
      amount: 185,
      status: 'pending',
      date: new Date(2026, 7, 22),
    },
    {
      id: '#ORD-1046',
      customer: 'Omar Ali',
      initials: 'OA',
      amount: 540,
      status: 'processing',
      date: new Date(2026, 7, 21),
    },
    {
      id: '#ORD-1045',
      customer: 'Nour Ahmed',
      initials: 'NA',
      amount: 96,
      status: 'refunded',
      date: new Date(2026, 7, 21),
    },
    {
      id: '#ORD-1044',
      customer: 'Youssef Adel',
      initials: 'YA',
      amount: 410,
      status: 'paid',
      date: new Date(2026, 7, 20),
    },
  ];

  getStatusKey(status: OrderStatus): string {
    return `DASHBOARD.ORDERS.STATUS.${status.toUpperCase()}`;
  }
}
