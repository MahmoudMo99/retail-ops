export type ProductSortOrder = 'asc' | 'desc';

export interface ProductsQuery {
  limit: number;
  skip: number;
  search?: string;
  category?: string;
  sortBy?: string;
  order?: ProductSortOrder;
}
