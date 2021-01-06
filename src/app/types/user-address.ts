export class UserAddress {
  constructor(
    public street: string,
    public city: string,
    public state: string,
    public zip: string,
    public country: string
  ) {}
}

export class UserAddressMaker {
  static create(event: UserAddress) {
    return {
      street: event.street,
      city: event.city,
      state: event.state,
      zip: event.zip,
      country: event.country,
    };
  }
}
