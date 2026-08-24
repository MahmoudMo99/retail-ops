import { Component, computed, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { finalize } from 'rxjs';

import { FormatterService } from '../../../../core/services/formatter';
import { OrderStatus, OrderView } from '../../models/order-view.model';
import { OrdersService } from '../../services/orders';

@Component({
  selector: 'app-orders',
  imports: [TableModule, DialogModule, TranslatePipe],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class Orders {
  private readonly ordersService = inject(OrdersService);

  readonly formatter = inject(FormatterService);

  readonly orders = signal<OrderView[]>([]);

  readonly loading = signal(false);

  readonly error = signal(false);

  readonly searchTerm = signal('');

  readonly selectedStatus = signal<OrderStatus | 'all'>('all');

  readonly selectedOrder = signal<OrderView | null>(null);

  readonly detailsVisible = signal(false);

  readonly orderStatusDraft = signal<OrderStatus>('pending');

  readonly filteredOrders = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();

    const status = this.selectedStatus();

    return this.orders().filter((order) => {
      const customerName = order.customer
        ? `${order.customer.firstName} ${order.customer.lastName}`.toLowerCase()
        : '';

      const customerEmail = order.customer?.email.toLowerCase() ?? '';

      const matchesSearch =
        !search ||
        order.orderNumber.toLowerCase().includes(search) ||
        customerName.includes(search) ||
        customerEmail.includes(search);

      const matchesStatus = status === 'all' || order.status === status;

      return matchesSearch && matchesStatus;
    });
  });

  constructor() {
    this.loadOrders();
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.searchTerm.set(value);
  }

  onStatusChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as OrderStatus | 'all';

    this.selectedStatus.set(value);
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedStatus.set('all');
  }

  viewOrder(order: OrderView): void {
    this.selectedOrder.set(order);

    this.orderStatusDraft.set(order.status);

    this.detailsVisible.set(true);
  }

  onOrderStatusChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as OrderStatus;

    this.orderStatusDraft.set(value);
  }

  saveOrderStatus(): void {
    const order = this.selectedOrder();

    if (!order) {
      return;
    }

    const status = this.orderStatusDraft();

    this.orders.update((orders) =>
      orders.map((item) =>
        item.id === order.id
          ? {
              ...item,
              status,
            }
          : item,
      ),
    );

    this.selectedOrder.set({
      ...order,
      status,
    });
  }

  getStatusKey(status: OrderStatus): string {
    return `ORDERS.STATUS.${status.toUpperCase()}`;
  }

  private loadOrders(): void {
    this.loading.set(true);
    this.error.set(false);

    this.ordersService
      .getAllOrders()
      .pipe(
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: (orders) => {
          this.orders.set(orders);
        },
        error: () => {
          this.orders.set([]);
          this.error.set(true);
        },
      });
  }
}
