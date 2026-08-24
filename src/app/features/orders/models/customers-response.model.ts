import { OrderCustomer } from './order-customer.model';

export interface CustomersResponse {
  users: OrderCustomer[];
  total: number;
  skip: number;
  limit: number;
}
