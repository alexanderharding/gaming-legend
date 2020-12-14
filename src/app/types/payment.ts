export class Payment {
  constructor(
    public cardNumber: number,
    public cvv: number,
    public expiringMonth: number,
    public expiringYear: number,
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
      total: event.total,
    };
  }
}
