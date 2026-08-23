import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { ProductCategory } from '../../models/product-category.model';
import { ProductPayload } from '../../models/product-payload.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm {
  private readonly fb = inject(FormBuilder);

  readonly product = input<Product | null>(null);
  readonly categories = input<ProductCategory[]>([]);
  readonly submitting = input(false);

  readonly submitted = output<ProductPayload>();
  readonly cancelled = output<void>();

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
    category: ['', Validators.required],
    brand: ['', Validators.maxLength(60)],
    price: [0, [Validators.required, Validators.min(0.01)]],
    discountPercentage: [0, [Validators.min(0), Validators.max(100)]],
    stock: [0, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
    thumbnail: [''],
  });

  constructor() {
    effect(() => {
      const product = this.product();

      if (product) {
        this.form.reset({
          title: product.title,
          description: product.description,
          category: product.category,
          brand: product.brand ?? '',
          price: product.price,
          discountPercentage: product.discountPercentage ?? 0,
          stock: product.stock,
          thumbnail: product.thumbnail ?? '',
        });

        return;
      }

      this.form.reset({
        title: '',
        description: '',
        category: '',
        brand: '',
        price: 0,
        discountPercentage: 0,
        stock: 0,
        thumbnail: '',
      });
    });
  }

  hasError(controlName: keyof typeof this.form.controls, errorName: string): boolean {
    const control = this.form.controls[controlName];

    return control.touched && control.hasError(errorName);
  }

  submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid || this.submitting()) {
      return;
    }

    this.submitted.emit(this.form.getRawValue());
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
