import { Payment, PaymentMaker } from './payment';

describe('Payment', () => {
  const cardNumber = 1214121474125;
  const cvv = 210;
  const expiration = '2023-05';
  // const subtotal = 123.33;
  // const tax = 100.25;
  // const shipping = 6.99;
  const total = 205.28;
  it('should create an instance', () => {
    expect(new Payment(cardNumber, expiration, cvv, total)).toBeTruthy();
  });
});

describe('PaymentMaker', () => {
  it('should create an instance', () => {
    expect(new PaymentMaker()).toBeTruthy();
  });
});
