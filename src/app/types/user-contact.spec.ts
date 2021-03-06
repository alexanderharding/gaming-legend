import { UserContact, UserContactMaker } from './user-contact';

describe('UserContact', () => {
  const phone = '8011231234';
  const email = 'test@test.com';
  it('should create an instance', () => {
    expect(new UserContact(phone, email)).toBeTruthy();
  });
});

describe('UserContactMaker', () => {
  it('should create an instance', () => {
    expect(new UserContactMaker()).toBeTruthy();
  });
});
