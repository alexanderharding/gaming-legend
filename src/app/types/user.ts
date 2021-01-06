import { UserAddress } from './user-address';
import { UserContact } from './user-contact';
import { UserName } from './user-name';

/* Defines the user entity */
export interface IUser {
  name: UserName;
  contact: UserContact;
  address?: UserAddress;
  password: string;
  isAdmin: boolean;
  id: number;
}
export class User {
  constructor(
    public name: UserName,
    public contact: UserContact,
    public password: string,
    public isAdmin: boolean,
    public address?: UserAddress,
    public id?: number
  ) {}
}

export class UserMaker {
  static create(event: User) {
    return {
      name: event.name,
      contact: event.contact,
      address: event.address,
      password: event.password,
      isAdmin: event.isAdmin,
    };
  }
}
