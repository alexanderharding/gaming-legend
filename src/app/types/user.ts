/* Defines the user entity */
export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  phone: number;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: number;
  country: string;
  password: string;
  isAdmin: boolean;
}
export class User {
  constructor(
    public firstName: string,
    public lastName: string,
    public phone: string,
    public email: string,
    public street: string,
    public city: string,
    public state: string,
    public zip: string,
    public country: string,
    public password: string,
    public isAdmin: boolean
  ) {}
}

export class UserMaker {
  static create(event: User) {
    return {
      firstName: event.firstName,
      lastName: event.lastName,
      phone: event.phone,
      email: event.email,
      street: event.street,
      city: event.city,
      state: event.state,
      zip: event.zip,
      country: event.country,
      password: event.password,
      isAdmin: event.isAdmin,
    };
  }
}
