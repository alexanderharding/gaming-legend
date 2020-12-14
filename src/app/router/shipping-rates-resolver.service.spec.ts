import { TestBed } from '@angular/core/testing';

import { ShippingRatesResolverService } from './shipping-rates-resolver.service';

describe('ShippingResolverService', () => {
  let service: ShippingRatesResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShippingRatesResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
