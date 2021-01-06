export class UserContact {
  constructor(public phone: string, public email: string) {}
}

export class UserContactMaker {
  static create(event: UserContact) {
    return {
      phone: event.phone,
      email: event.email,
    };
  }
}
