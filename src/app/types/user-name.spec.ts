import { UserName } from './user-name';

describe('UserName', () => {
  const firstName = 'John';
  const lastName = 'Doe';
  it('should create an instance', () => {
    expect(new UserName(firstName, lastName)).toBeTruthy();
  });
});
