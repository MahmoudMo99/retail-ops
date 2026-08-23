import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

interface TopProduct {
  id: number;
  name: string;
  category: string;
  sales: number;
  revenue: number;
  icon: string;
  accent: string;
}

@Component({
  selector: 'app-top-products',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './top-products.html',
  styleUrl: './top-products.scss',
})
export class TopProducts {
  readonly products: TopProduct[] = [
    {
      id: 1,
      name: 'Wireless Headphones',
      category: 'Electronics',
      sales: 842,
      revenue: 42100,
      icon: 'pi pi-headphones',
      accent: 'primary',
    },
    {
      id: 2,
      name: 'Running Sneakers',
      category: 'Fashion',
      sales: 674,
      revenue: 26960,
      icon: 'pi pi-shopping-bag',
      accent: 'blue',
    },
    {
      id: 3,
      name: 'Smart Watch',
      category: 'Electronics',
      sales: 523,
      revenue: 39225,
      icon: 'pi pi-stopwatch',
      accent: 'green',
    },
    {
      id: 4,
      name: 'Skin Care Set',
      category: 'Beauty',
      sales: 418,
      revenue: 14630,
      icon: 'pi pi-sparkles',
      accent: 'orange',
    },
  ];

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  }
}
