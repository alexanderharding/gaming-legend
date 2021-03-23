import { TestBed } from '@angular/core/testing';

import { ProductTypesResolverService } from './product-types-resolver.service';

xdescribe('ProductTypeResolverService', () => {
  let service: ProductTypesResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductTypesResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
