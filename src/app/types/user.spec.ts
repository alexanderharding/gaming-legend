import { User } from './user';

describe('User', () => {
  const userName = {
    firstName: 'John',
    lastName: 'Doe',
  };
  const contact = {
    phone: '8011231234',
    email: 'test@test.com',
  };
  const password = 'TestPassword1234';
  const isAdmin = false;
  const address = {
    street: '123 S Bend Ct',
    city: 'Las Vegas',
    state: 'Nevada',
    zip: '12345',
    country: 'USA',
  };
  const id = 2;

  it('should create an instance', () => {
    expect(
      new User(userName, contact, password, isAdmin, address, id)
    ).toBeTruthy();
  });

  it('should not break if address is null', () => {
    expect(
      new User(userName, contact, password, isAdmin, null, id)
    ).toBeTruthy();
  });

  it('should not break if id is null', () => {
    expect(
      new User(userName, contact, password, isAdmin, address, null)
    ).toBeTruthy();
  });
});
