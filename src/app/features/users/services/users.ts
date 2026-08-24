import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { UserPayload } from '../models/user-payload.model';
import { AppUser } from '../models/user.model';
import { UsersQuery } from '../models/users-query.model';
import { UsersResponse } from '../models/users-response.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/users`;

  getUsers(query: UsersQuery): Observable<UsersResponse> {
    let params = new HttpParams()
      .set('limit', query.limit)
      .set('skip', query.skip)
      .set(
        'select',
        ['id', 'firstName', 'lastName', 'username', 'email', 'phone', 'image', 'role'].join(','),
      );

    if (query.sortBy && query.order) {
      params = params.set('sortBy', query.sortBy).set('order', query.order);
    }

    let endpoint = this.apiUrl;

    if (query.search?.trim()) {
      endpoint = `${this.apiUrl}/search`;

      params = params.set('q', query.search.trim());
    }

    return this.http.get<UsersResponse>(endpoint, { params });
  }

  getUserById(id: number): Observable<AppUser> {
    return this.http.get<AppUser>(`${this.apiUrl}/${id}`);
  }

  addUser(payload: UserPayload): Observable<AppUser> {
    return this.http.post<AppUser>(`${this.apiUrl}/add`, payload);
  }

  updateUser(id: number, payload: UserPayload): Observable<AppUser> {
    return this.http.patch<AppUser>(`${this.apiUrl}/${id}`, payload);
  }

  deleteUser(id: number): Observable<AppUser> {
    return this.http.delete<AppUser>(`${this.apiUrl}/${id}`);
  }
}
