import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AppNotification } from '../models/notification.model';

interface NotificationProduct {
  id: number;
  title: string;
  stock: number;
}

interface ProductsResponse {
  products: NotificationProduct[];
}

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/products`;

  readonly notifications = signal<AppNotification[]>([]);

  readonly loading = signal(false);

  readonly loaded = signal(false);

  readonly unreadCount = computed(
    () => this.notifications().filter((notification) => !notification.isRead).length,
  );

  load(): void {
    if (this.loading() || this.loaded()) {
      return;
    }

    const params = new HttpParams().set('limit', 0).set('select', 'id,title,stock');

    this.loading.set(true);

    this.http
      .get<ProductsResponse>(this.apiUrl, { params })
      .pipe(
        finalize(() => {
          this.loading.set(false);
          this.loaded.set(true);
        }),
      )
      .subscribe({
        next: (response) => {
          this.notifications.set(this.buildNotifications(response.products));
        },
        error: () => {
          this.notifications.set([]);
        },
      });
  }

  markAsRead(id: string): void {
    this.notifications.update((notifications) =>
      notifications.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              isRead: true,
            }
          : notification,
      ),
    );
  }

  markAllAsRead(): void {
    this.notifications.update((notifications) =>
      notifications.map((notification) => ({
        ...notification,
        isRead: true,
      })),
    );
  }

  private buildNotifications(products: NotificationProduct[]): AppNotification[] {
    const outOfStock = products
      .filter((product) => product.stock === 0)
      .slice(0, 3)
      .map((product): AppNotification => ({
        id: `out-${product.id}`,
        type: 'danger',
        titleKey: 'NOTIFICATIONS.OUT_OF_STOCK_TITLE',
        messageKey: 'NOTIFICATIONS.OUT_OF_STOCK_MESSAGE',
        params: {
          name: product.title,
        },
        icon: 'pi pi-times-circle',
        route: '/inventory',
        isRead: false,
      }));

    const lowStock = products
      .filter((product) => product.stock > 0 && product.stock <= 10)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 4)
      .map((product): AppNotification => ({
        id: `low-${product.id}`,
        type: 'warning',
        titleKey: 'NOTIFICATIONS.LOW_STOCK_TITLE',
        messageKey: 'NOTIFICATIONS.LOW_STOCK_MESSAGE',
        params: {
          name: product.title,
          stock: product.stock,
        },
        icon: 'pi pi-exclamation-triangle',
        route: '/inventory',
        isRead: false,
      }));

    return [...outOfStock, ...lowStock];
  }
}
