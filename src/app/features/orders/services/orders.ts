import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { CustomersResponse } from '../models/customers-response.model';
import { OrderStatus, OrderView } from '../models/order-view.model';
import { OrdersResponse } from '../models/orders-response.model';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl;

  getAllOrders(): Observable<OrderView[]> {
    const cartParams = new HttpParams().set('limit', 0);

    const userParams = new HttpParams()
      .set('limit', 0)
      .set('select', 'id,firstName,lastName,email,image');

    return forkJoin({
      cartsResponse: this.http.get<OrdersResponse>(`${this.apiUrl}/carts`, {
        params: cartParams,
      }),
      usersResponse: this.http.get<CustomersResponse>(`${this.apiUrl}/users`, {
        params: userParams,
      }),
    }).pipe(
      map(({ cartsResponse, usersResponse }) => {
        const usersMap = new Map(usersResponse.users.map((user) => [user.id, user]));

        return cartsResponse.carts.map((cart): OrderView => ({
          id: cart.id,
          orderNumber: `#ORD-${String(cart.id).padStart(4, '0')}`,
          customer: usersMap.get(cart.userId) ?? null,
          products: cart.products,
          total: cart.total,
          discountedTotal: cart.discountedTotal,
          totalProducts: cart.totalProducts,
          totalQuantity: cart.totalQuantity,
          status: this.getInitialStatus(cart.id),
        }));
      }),
    );
  }

  private getInitialStatus(id: number): OrderStatus {
    const statuses: OrderStatus[] = ['paid', 'processing', 'pending', 'paid', 'paid', 'cancelled'];

    return statuses[id % statuses.length];
  }
}
