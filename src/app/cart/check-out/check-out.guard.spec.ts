import { TestBed } from '@angular/core/testing';

import { CheckOutGuard } from './check-out.guard';

describe('CheckOutGuard', () => {
  let guard: CheckOutGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CheckOutGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
