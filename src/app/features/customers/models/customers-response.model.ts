import { Customer } from './customer.model';

export interface CustomersResponse {
  users: Customer[];
  total: number;
  skip: number;
  limit: number;
}
