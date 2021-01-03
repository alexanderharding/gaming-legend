import { IProduct } from './product';
import { Customer } from './customer';
import { Payment } from './payment';

export interface IOrder {
  customer: Customer;
  items: IProduct[];
  payment: Payment;
  date: Date;
  status: string;
  userId?: number;
  id: number;
}

export class Order {
  constructor(
    public customer: Customer,
    public items: IProduct[],
    public payment: Payment,
    public date: Date,
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
