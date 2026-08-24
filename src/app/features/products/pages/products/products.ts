import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { SortIcon, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { debounceTime, distinctUntilChanged, finalize, Subject } from 'rxjs';

import { FormatterService } from '../../../../core/services/formatter';
import { ProductDetails } from '../../components/product-details/product-details';
import { ProductForm } from '../../components/product-form/product-form';
import { ProductCategory } from '../../models/product-category.model';
import { ProductPayload } from '../../models/product-payload.model';
import { Product } from '../../models/product.model';
import { ProductSortOrder, ProductsQuery } from '../../models/products-query.model';
import { ProductsService } from '../../services/products';

@Component({
  selector: 'app-products',
  imports: [
    TableModule,
    SortIcon,
    DialogModule,
    ConfirmDialogModule,
    TranslatePipe,
    ProductDetails,
    ProductForm,
  ],
  providers: [ConfirmationService],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products {
  private readonly productsService = inject(ProductsService);

  private readonly destroyRef = inject(DestroyRef);

  private readonly confirmationService = inject(ConfirmationService);

  private readonly translate = inject(TranslateService);

  readonly formatter = inject(FormatterService);

  private readonly searchSubject = new Subject<string>();

  readonly products = signal<Product[]>([]);

  readonly categories = signal<ProductCategory[]>([]);

  readonly total = signal(0);

  readonly loading = signal(false);

  readonly error = signal(false);

  readonly first = signal(0);

  readonly rows = signal(10);

  readonly searchTerm = signal('');

  readonly selectedCategory = signal('');

  readonly filtersOpen = signal(false);

  readonly selectedProduct = signal<Product | null>(null);

  readonly detailsVisible = signal(false);

  readonly detailsLoading = signal(false);

  readonly formVisible = signal(false);

  readonly formSubmitting = signal(false);

  readonly editingProduct = signal<Product | null>(null);

  readonly deletingProductId = signal<number | null>(null);

  private sortBy?: string;

  private sortOrder?: ProductSortOrder;

  constructor() {
    this.loadCategories();

    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.searchTerm.set(value);
        this.first.set(0);

        this.fetchProducts();
      });
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.searchSubject.next(value);
  }

  onCategoryChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;

    this.selectedCategory.set(value);

    this.searchTerm.set('');
    this.first.set(0);

    this.fetchProducts();
  }

  toggleFilters(): void {
    this.filtersOpen.update((isOpen) => !isOpen);
  }

  clearFilters(): void {
    this.selectedCategory.set('');
    this.searchTerm.set('');
    this.first.set(0);

    this.fetchProducts();
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

    this.fetchProducts();
  }

  getStockStatus(product: Product): 'in-stock' | 'low-stock' | 'out-of-stock' {
    if (product.stock === 0) {
      return 'out-of-stock';
    }

    if (product.stock <= 10) {
      return 'low-stock';
    }

    return 'in-stock';
  }

  getStockTranslation(product: Product): string {
    const status = this.getStockStatus(product);

    const keyMap = {
      'in-stock': 'IN_STOCK',
      'low-stock': 'LOW_STOCK',
      'out-of-stock': 'OUT_OF_STOCK',
    };

    return `PRODUCTS.STATUS.${keyMap[status]}`;
  }

  viewProduct(id: number): void {
    this.detailsLoading.set(true);
    this.detailsVisible.set(true);
    this.selectedProduct.set(null);

    this.productsService
      .getProductById(id)
      .pipe(
        finalize(() => {
          this.detailsLoading.set(false);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (product) => {
          this.selectedProduct.set(product);
        },
        error: () => {
          this.detailsVisible.set(false);
        },
      });
  }

  openAddProduct(): void {
    this.editingProduct.set(null);
    this.formVisible.set(true);
  }

  openEditProduct(product: Product): void {
    this.formSubmitting.set(false);

    this.productsService
      .getProductById(product.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (fullProduct) => {
          this.editingProduct.set(fullProduct);

          this.formVisible.set(true);
        },
      });
  }

  closeProductForm(): void {
    if (this.formSubmitting()) {
      return;
    }

    this.formVisible.set(false);
    this.editingProduct.set(null);
  }

  saveProduct(payload: ProductPayload): void {
    const product = this.editingProduct();

    this.formSubmitting.set(true);

    const request$ = product
      ? this.productsService.updateProduct(product.id, payload)
      : this.productsService.addProduct(payload);

    request$
      .pipe(
        finalize(() => {
          this.formSubmitting.set(false);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (savedProduct) => {
          if (product) {
            this.products.update((products) =>
              products.map((item) =>
                item.id === product.id
                  ? {
                      ...item,
                      ...savedProduct,
                    }
                  : item,
              ),
            );
          } else {
            this.products.update((products) => [savedProduct, ...products]);

            this.total.update((total) => total + 1);
          }

          this.formVisible.set(false);

          this.editingProduct.set(null);
        },
      });
  }

  confirmDelete(event: Event, product: Product): void {
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      header: this.translate.instant('PRODUCTS.DELETE.TITLE'),
      message: this.translate.instant('PRODUCTS.DELETE.MESSAGE', {
        name: product.title,
      }),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.translate.instant('PRODUCTS.DELETE.CONFIRM'),
      rejectLabel: this.translate.instant('COMMON.CANCEL'),
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.deleteProduct(product.id);
      },
    });
  }

  private loadCategories(): void {
    this.productsService
      .getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (categories) => {
          this.categories.set(categories);
        },
      });
  }

  private fetchProducts(): void {
    const query: ProductsQuery = {
      limit: this.rows(),
      skip: this.first(),
      search: this.searchTerm(),
      category: this.selectedCategory(),
      sortBy: this.sortBy,
      order: this.sortOrder,
    };

    this.loading.set(true);
    this.error.set(false);

    this.productsService
      .getProducts(query)
      .pipe(
        finalize(() => {
          this.loading.set(false);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (response) => {
          this.products.set(response.products);

          this.total.set(response.total);
        },
        error: () => {
          this.products.set([]);
          this.total.set(0);
          this.error.set(true);
        },
      });
  }

  private deleteProduct(id: number): void {
    this.deletingProductId.set(id);

    this.productsService
      .deleteProduct(id)
      .pipe(
        finalize(() => {
          this.deletingProductId.set(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.products.update((products) => products.filter((product) => product.id !== id));

          this.total.update((total) => Math.max(0, total - 1));
        },
      });
  }
}
