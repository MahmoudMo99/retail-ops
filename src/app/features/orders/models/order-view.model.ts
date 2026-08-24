import { OrderCustomer } from './order-customer.model';
import { OrderCart } from './order.model';

export type OrderStatus = 'paid' | 'pending' | 'processing' | 'cancelled';

export interface OrderView {
  id: number;
  orderNumber: string;
  customer: OrderCustomer | null;
  products: OrderCart['products'];
  total: number;
  discountedTotal: number;
  totalProducts: number;
  totalQuantity: number;
  status: OrderStatus;
}
