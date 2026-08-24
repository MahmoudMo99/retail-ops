import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { AnalyticsData, CategoryAnalytics, ProductAnalytics } from '../models/analytics-data.model';

interface AnalyticsProduct {
  id: number;
  title: string;
  category: string;
  price: number;
  stock: number;
  thumbnail: string;
}

interface ProductsResponse {
  products: AnalyticsProduct[];
}

interface CartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountedTotal?: number;
  thumbnail: string;
}

interface Cart {
  id: number;
  products: CartProduct[];
  total: number;
  discountedTotal: number;
  userId: number;
}

interface CartsResponse {
  carts: Cart[];
}

interface UsersResponse {
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl;

  getAnalytics(): Observable<AnalyticsData> {
    const productParams = new HttpParams()
      .set('limit', 0)
      .set('select', ['id', 'title', 'category', 'price', 'stock', 'thumbnail'].join(','));

    const cartParams = new HttpParams().set('limit', 0);

    const userParams = new HttpParams().set('limit', 1).set('select', 'id');

    return forkJoin({
      productsResponse: this.http.get<ProductsResponse>(`${this.apiUrl}/products`, {
        params: productParams,
      }),

      cartsResponse: this.http.get<CartsResponse>(`${this.apiUrl}/carts`, {
        params: cartParams,
      }),

      usersResponse: this.http.get<UsersResponse>(`${this.apiUrl}/users`, {
        params: userParams,
      }),
    }).pipe(
      map(({ productsResponse, cartsResponse, usersResponse }) => {
        const products = productsResponse.products;

        const carts = cartsResponse.carts;

        const totalRevenue = carts.reduce((total, cart) => total + cart.discountedTotal, 0);

        const totalOrders = carts.length;

        const averageOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

        const categories = this.buildCategoryAnalytics(products, carts);

        const topProducts = this.buildProductAnalytics(carts);

        const orderStatuses = this.buildStatusAnalytics(carts);

        const inventory = {
          inStock: products.filter((product) => product.stock > 10).length,

          lowStock: products.filter((product) => product.stock > 0 && product.stock <= 10).length,

          outOfStock: products.filter((product) => product.stock === 0).length,
        };

        return {
          kpis: {
            totalRevenue,
            totalOrders,
            totalCustomers: usersResponse.total,
            averageOrderValue,
          },

          categories,
          topProducts,
          orderStatuses,
          inventory,
        };
      }),
    );
  }

  private buildCategoryAnalytics(products: AnalyticsProduct[], carts: Cart[]): CategoryAnalytics[] {
    const productCategoryMap = new Map(products.map((product) => [product.id, product.category]));

    const categoryMap = new Map<string, CategoryAnalytics>();

    for (const product of products) {
      const current = categoryMap.get(product.category);

      if (current) {
        current.products += 1;
      } else {
        categoryMap.set(product.category, {
          category: product.category,
          revenue: 0,
          products: 1,
        });
      }
    }

    for (const cart of carts) {
      for (const product of cart.products) {
        const category = productCategoryMap.get(product.id);

        if (!category) {
          continue;
        }

        const current = categoryMap.get(category);

        if (!current) {
          continue;
        }

        current.revenue += product.discountedTotal ?? product.total;
      }
    }

    return [...categoryMap.values()].sort((a, b) => b.revenue - a.revenue);
  }

  private buildProductAnalytics(carts: Cart[]): ProductAnalytics[] {
    const productMap = new Map<number, ProductAnalytics>();

    for (const cart of carts) {
      for (const product of cart.products) {
        const current = productMap.get(product.id);

        if (current) {
          current.quantity += product.quantity;

          current.revenue += product.discountedTotal ?? product.total;

          continue;
        }

        productMap.set(product.id, {
          id: product.id,
          title: product.title,
          thumbnail: product.thumbnail,
          quantity: product.quantity,
          revenue: product.discountedTotal ?? product.total,
        });
      }
    }

    return [...productMap.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }

  private buildStatusAnalytics(carts: Cart[]) {
    const statuses = ['paid', 'processing', 'pending', 'paid', 'paid', 'cancelled'];

    const statusMap = new Map<string, number>();

    for (const cart of carts) {
      const status = statuses[cart.id % statuses.length];

      statusMap.set(status, (statusMap.get(status) ?? 0) + 1);
    }

    return [...statusMap.entries()].map(([status, count]) => ({
      status,
      count,
    }));
  }
}
