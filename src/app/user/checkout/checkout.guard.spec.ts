import { TestBed } from '@angular/core/testing';

import { CheckoutGuard } from './checkout.guard';

xdescribe('CheckoutGuard', () => {
  let guard: CheckoutGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CheckoutGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
