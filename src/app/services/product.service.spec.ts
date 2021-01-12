import { inject, TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('ProductService', () => {
  let productType;
  let productId;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductService],
      imports: [HttpClientTestingModule],
    });
  });

  // describe('getProductsWithBrand', () => {
  //   it('should call http client with the correct url', inject(
  //     [ProductService, HttpTestingController],
  //     (service: ProductService, controller: HttpTestingController) => {
  //       // Arrange
  //       productType = 'laptops';

  //       // Act
  //       service.getProductsWithBrand(productType).subscribe();

  //       // Assert
  //       controller.expectOne(`http://localhost:3000/${productType}`);
  //       controller.expectOne(
  //         `http://localhost:3000/brands/?type=${productType}`
  //       );
  //       controller.verify();
  //     }
  //   ));
  // });

  // describe('getProductWithBrand', () => {
  //   it('should call http client with the correct url', inject(
  //     [ProductService, HttpTestingController],
  //     (service: ProductService, controller: HttpTestingController) => {
  //       // Arrange
  //       productType = 'laptops';
  //       productId = 1;

  //       // Act
  //       service.getProductWithBrand(productType, productId).subscribe();

  //       // Assert
  //       controller.expectOne(
  //         `http://localhost:3000/${productType}/${productId}`
  //       );
  //       controller.expectOne(
  //         `http://localhost:3000/brands/?type=${productType}`
  //       );
  //       controller.verify();
  //     }
  //   ));
  // });
});
