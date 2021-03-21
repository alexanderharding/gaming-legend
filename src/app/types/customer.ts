export class Customer {
  constructor(
    public firstName: string,
    public lastName: string,
    public phone: string,
    public email: string,
    public street: string,
    public street2: string,
    public city: string,
    public state: string,
    public zip: string,
    public country: string
  ) {}
}

export class CustomerMaker {
  static create(event: Customer) {
    return {
      firstName: event.firstName,
      lastName: event.lastName,
      phone: event.phone,
      email: event.email,
      street: event.street,
      street2: event.street2,
      city: event.city,
      state: event.state,
      zip: event.zip,
      country: event.country,
    };
  }
}
