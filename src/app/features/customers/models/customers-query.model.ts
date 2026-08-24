export type CustomerSortOrder = 'asc' | 'desc';

export interface CustomersQuery {
  limit: number;
  skip: number;
  search?: string;
  sortBy?: string;
  order?: CustomerSortOrder;
}
