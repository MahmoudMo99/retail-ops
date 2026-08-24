import { Component, inject, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { FormatterService } from '../../../../core/services/formatter';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-details',
  imports: [TranslatePipe],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails {
  readonly formatter = inject(FormatterService);

  readonly product = input.required<Product>();
}
