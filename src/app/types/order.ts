import { IProduct } from './product';
import { Customer } from './customer';
import { Payment } from './payment';
export class Order {
  constructor(
    public customer: Customer,
    public items: IProduct[],
    public payment: Payment
  ) {}
}
export class OrderMaker {
  static create(event: Order) {
    return {
      customer: event.customer,
      items: event.items,
      payment: event.payment,
    };
  }
}
