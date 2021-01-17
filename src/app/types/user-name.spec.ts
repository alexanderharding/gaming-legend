import { UserName } from './user-name';

fdescribe('UserName', () => {
  const firstName = 'John';
  const lastName = 'Doe';
  it('should create an instance', () => {
    expect(new UserName(firstName, lastName)).toBeTruthy();
  });
});
