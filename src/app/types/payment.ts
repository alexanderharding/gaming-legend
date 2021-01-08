export class Payment {
  constructor(
    public cardNumber: number,
    public cvv: number,
    public expiringMonth: number,
    public expiringYear: number,
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
      cvv: event.cvv,
      expiringMonth: event.expiringMonth,
      expiringYear: event.expiringYear,
      subtotal: event.subtotal,
      tax: event.tax,
      shipping: event.shipping,
      total: event.total,
    };
  }
}
