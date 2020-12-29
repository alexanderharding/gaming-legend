import { IOrder } from './order';

export class OrdersResult {
  orders: IOrder[];
  error?: string;
}
