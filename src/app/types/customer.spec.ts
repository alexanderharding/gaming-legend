import { Customer, CustomerMaker } from './customer';

describe('Customer', () => {
  const firstName = 'John';
  const lastName = 'Doe';
  const phone = '8011231234';
  const email = 'test@test.com';
  const street = '123 S Bend Ct';
  const city = 'Las Vegas';
  const state = 'Nevada';
  const zip = '12345';
  const country = 'USA';
  it('should create an instance', () => {
    expect(
      new Customer(
        firstName,
        lastName,
        phone,
        email,
        street,
        city,
        state,
        zip,
        country
      )
    ).toBeTruthy();
  });
});

describe('CustomerMaker', () => {
  it('should create an instance', () => {
    expect(new CustomerMaker()).toBeTruthy();
  });
});
