import { OrderCart } from './order.model';

export interface OrdersResponse {
  carts: OrderCart[];
  total: number;
  skip: number;
  limit: number;
}
