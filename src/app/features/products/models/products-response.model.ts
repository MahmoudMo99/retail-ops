import { PaginatedResponse } from '../../../core/models/paginated-response.model';
import { Product } from './product.model';

export interface ProductsResponse extends PaginatedResponse<Product> {
  products: Product[];
}
