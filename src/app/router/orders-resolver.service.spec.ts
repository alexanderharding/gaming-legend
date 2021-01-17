import { TestBed } from '@angular/core/testing';

import { OrdersResolverService } from './orders-resolver.service';

xdescribe('OrdersResolverService', () => {
  let service: OrdersResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdersResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
