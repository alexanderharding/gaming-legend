import { TestBed } from '@angular/core/testing';

import { CartItemsResolverService } from './cart-items-resolver.service';

describe('CartItemsResolverService', () => {
  let service: CartItemsResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartItemsResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
