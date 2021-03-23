export class Payment {
  constructor(
    public cardNumber: number,
    public expiration: string,
    public cvv: number,
    public total: number
  ) {}
}

export class PaymentMaker {
  static create(event: Payment) {
    return {
      cardNumber: event.cardNumber,
      expiration: event.expiration,
      cvv: event.cvv,
      total: event.total,
    };
  }
}
