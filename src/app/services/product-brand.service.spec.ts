import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { IProductBrand } from '../types/product-brand';
import { ProductBrandService } from './product-brand.service';

describe('ProductBrandService', () => {
  let productType, BRANDS;
  beforeEach(() => {
    BRANDS = [
      {
        id: 1,
        name: 'Lenovo',
      },
      {
        id: 2,
        name: 'Samsung',
      },
      {
        id: 3,
        name: 'Dell',
      },
      {
        id: 4,
        name: 'Microsoft',
      },
    ];
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
        const req = controller.expectOne(
          `http://localhost:3000/${productType}Brands`
        );
        expect(req.request.method).toEqual('GET');
        controller.verify();
        req.flush({ brands: BRANDS });
      }
    ));
  });
});
