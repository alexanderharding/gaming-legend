export class Payment {
  constructor(
    public cardNumber: number,
    public expiration: string,
    public cvv: number,
    public subtotal: number,
    public tax: number,
    public shipping: number,
    public total: number
  ) {}
}

export class PaymentMaker {
  static create(event: Payment) {
    return {
      cardNumber: event.cardNumber,
      expiration: event.expiration,
      cvv: event.cvv,
      subtotal: event.subtotal,
      tax: event.tax,
      shipping: event.shipping,
      total: event.total,
    };
  }
}
