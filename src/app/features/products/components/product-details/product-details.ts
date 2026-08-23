import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-details',
  imports: [TranslatePipe],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails {
  readonly product = input.required<Product>();

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  }
}
