import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { SortIcon, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { debounceTime, distinctUntilChanged, finalize, Subject } from 'rxjs';

import { Customer } from '../../models/customer.model';
import { CustomerSortOrder, CustomersQuery } from '../../models/customers-query.model';
import { CustomersService } from '../../services/customers';

@Component({
  selector: 'app-customers',
  imports: [TableModule, SortIcon, DialogModule, TranslatePipe],
  templateUrl: './customers.html',
  styleUrl: './customers.scss',
})
export class Customers {
  private readonly customersService = inject(CustomersService);

  private readonly destroyRef = inject(DestroyRef);

  private readonly searchSubject = new Subject<string>();

  readonly customers = signal<Customer[]>([]);

  readonly total = signal(0);
  readonly loading = signal(false);
  readonly error = signal(false);

  readonly first = signal(0);
  readonly rows = signal(10);

  readonly searchTerm = signal('');

  readonly selectedCustomer = signal<Customer | null>(null);

  readonly detailsVisible = signal(false);
  readonly detailsLoading = signal(false);

  private sortBy?: string;
  private sortOrder?: CustomerSortOrder;

  constructor() {
    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.searchTerm.set(value);
        this.first.set(0);

        this.loadCustomers();
      });
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.searchSubject.next(value);
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    this.first.set(event.first ?? 0);
    this.rows.set(event.rows ?? 10);

    if (typeof event.sortField === 'string' && event.sortOrder) {
      this.sortBy = event.sortField;

      this.sortOrder = event.sortOrder === 1 ? 'asc' : 'desc';
    } else {
      this.sortBy = undefined;
      this.sortOrder = undefined;
    }

    this.loadCustomers();
  }

  viewCustomer(id: number): void {
    this.detailsLoading.set(true);
    this.detailsVisible.set(true);
    this.selectedCustomer.set(null);

    this.customersService
      .getCustomerById(id)
      .pipe(
        finalize(() => {
          this.detailsLoading.set(false);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (customer) => {
          this.selectedCustomer.set(customer);
        },
        error: () => {
          this.detailsVisible.set(false);
        },
      });
  }

  getRoleClass(role: string): string {
    return role.toLowerCase();
  }

  private loadCustomers(): void {
    const query: CustomersQuery = {
      limit: this.rows(),
      skip: this.first(),
      search: this.searchTerm(),
      sortBy: this.sortBy,
      order: this.sortOrder,
    };

    this.loading.set(true);
    this.error.set(false);

    this.customersService
      .getCustomers(query)
      .pipe(
        finalize(() => {
          this.loading.set(false);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (response) => {
          this.customers.set(response.users);

          this.total.set(response.total);
        },
        error: () => {
          this.customers.set([]);
          this.total.set(0);
          this.error.set(true);
        },
      });
  }
}
