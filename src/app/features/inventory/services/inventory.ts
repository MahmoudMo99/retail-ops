import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { InventoryData } from '../models/inventory-data.model';
import { InventoryItem, InventoryStatus } from '../models/inventory-item.model';

interface InventoryApiProduct {
  id: number;
  title: string;
  sku: string;
  category: string;
  brand?: string;
  price: number;
  stock: number;
  thumbnail: string;
}

interface InventoryApiResponse {
  products: InventoryApiProduct[];
  total: number;
  skip: number;
  limit: number;
}

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/products`;

  getInventory(): Observable<InventoryData> {
    const params = new HttpParams()
      .set('limit', 0)
      .set(
        'select',
        ['id', 'title', 'sku', 'category', 'brand', 'price', 'stock', 'thumbnail'].join(','),
      );

    return this.http.get<InventoryApiResponse>(this.apiUrl, { params }).pipe(
      map((response) => {
        const items = response.products.map((product): InventoryItem => ({
          ...product,
          status: this.getStockStatus(product.stock),
        }));

        const totalUnits = items.reduce((total, item) => total + item.stock, 0);

        const inventoryValue = items.reduce((total, item) => total + item.stock * item.price, 0);

        return {
          items,
          summary: {
            totalProducts: items.length,

            totalUnits,

            inStock: items.filter((item) => item.status === 'in-stock').length,

            lowStock: items.filter((item) => item.status === 'low-stock').length,

            outOfStock: items.filter((item) => item.status === 'out-of-stock').length,

            inventoryValue,
          },
        };
      }),
    );
  }

  private getStockStatus(stock: number): InventoryStatus {
    if (stock === 0) {
      return 'out-of-stock';
    }

    if (stock <= 10) {
      return 'low-stock';
    }

    return 'in-stock';
  }

  updateStock(
    id: number,
    stock: number,
  ): Observable<{
    id: number;
    stock: number;
  }> {
    return this.http.patch<{
      id: number;
      stock: number;
    }>(`${this.apiUrl}/${id}`, { stock });
  }
}
