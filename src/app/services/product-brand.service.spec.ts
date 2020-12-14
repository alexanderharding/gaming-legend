import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { ProductBrandService } from './product-brand.service';

describe('ProductBrandService', () => {
  let productType;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductBrandService],
      imports: [HttpClientTestingModule],
    });
  });

  describe('getBrands', () => {
    it('should call http client with the correct url', inject(
      [ProductBrandService, HttpTestingController],
      (service: ProductBrandService, controller: HttpTestingController) => {
        // Arrange
        productType = 'laptops';

        // Act
        service.getBrands(productType).subscribe();

        // Assert
        controller.expectOne(`http://localhost:3000/${productType}Brands`);
        controller.verify();
      }
    ));
  });
});
