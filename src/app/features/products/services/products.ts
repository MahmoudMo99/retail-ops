import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ProductCategory } from '../models/product-category.model';
import { ProductPayload } from '../models/product-payload.model';
import { Product } from '../models/product.model';
import { ProductsQuery } from '../models/products-query.model';
import { ProductsResponse } from '../models/products-response.model';
@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/products`;

  getProducts(query: ProductsQuery): Observable<ProductsResponse> {
    let params = new HttpParams()
      .set('limit', query.limit)
      .set('skip', query.skip)
      .set(
        'select',
        [
          'id',
          'title',
          'description',
          'category',
          'price',
          'discountPercentage',
          'rating',
          'stock',
          'brand',
          'thumbnail',
          'availabilityStatus',
        ].join(','),
      );

    if (query.sortBy && query.order) {
      params = params.set('sortBy', query.sortBy).set('order', query.order);
    }

    let endpoint = this.apiUrl;

    if (query.search?.trim()) {
      endpoint = `${this.apiUrl}/search`;
      params = params.set('q', query.search.trim());
    } else if (query.category) {
      endpoint = `${this.apiUrl}/category/${query.category}`;
    }

    return this.http.get<ProductsResponse>(endpoint, { params });
  }

  getCategories(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(`${this.apiUrl}/categories`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  addProduct(payload: ProductPayload): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/add`, payload);
  }

  updateProduct(id: number, payload: ProductPayload): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${id}`, payload);
  }
  deleteProduct(id: number): Observable<Product> {
    return this.http.delete<Product>(`${this.apiUrl}/${id}`);
  }
}
