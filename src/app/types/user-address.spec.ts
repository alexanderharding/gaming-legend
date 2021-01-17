import { UserAddress } from './user-address';

describe('UserAddress', () => {
  const street = '123 S Bend Ct';
  const city = 'Las Vegas';
  const state = 'Nevada';
  const zip = '12345';
  const country = 'USA';
  it('should create an instance', () => {
    expect(new UserAddress(street, city, state, zip, country)).toBeTruthy();
  });
});
