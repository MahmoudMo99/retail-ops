import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Customer } from '../models/customer.model';
import { CustomersQuery } from '../models/customers-query.model';
import { CustomersResponse } from '../models/customers-response.model';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/users`;

  getCustomers(query: CustomersQuery): Observable<CustomersResponse> {
    let params = new HttpParams()
      .set('limit', query.limit)
      .set('skip', query.skip)
      .set(
        'select',
        [
          'id',
          'firstName',
          'lastName',
          'age',
          'gender',
          'email',
          'phone',
          'username',
          'image',
          'role',
          'company',
        ].join(','),
      );

    if (query.sortBy && query.order) {
      params = params.set('sortBy', query.sortBy).set('order', query.order);
    }

    let endpoint = this.apiUrl;

    if (query.search?.trim()) {
      endpoint = `${this.apiUrl}/search`;

      params = params.set('q', query.search.trim());
    }

    return this.http.get<CustomersResponse>(endpoint, { params });
  }

  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }
}
