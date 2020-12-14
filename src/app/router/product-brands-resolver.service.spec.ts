import { TestBed } from '@angular/core/testing';

import { ProductBrandsResolverService } from './product-brands-resolver.service';

describe('BrandsResolverService', () => {
  let service: ProductBrandsResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductBrandsResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
