import { Customer } from './customer';
import { Payment } from './payment';
import { ICartItem } from './cart-item';

export interface IOrder {
  customer: Customer;
  items: ICartItem[];
  payment: Payment;
  date: string;
  status: string;
  userId?: number;
  id: number;
}

export class Order {
  constructor(
    public customer: Customer,
    public items: ICartItem[],
    public payment: Payment,
    public date: string,
    public status: string,
    public userId?: number,
    public id?: number
  ) {}
}
export class OrderMaker {
  static create(event: Order) {
    return {
      customer: event.customer,
      items: event.items,
      payment: event.payment,
      date: event.date,
      status: event.status,
      userId: event.userId,
    };
  }
}
