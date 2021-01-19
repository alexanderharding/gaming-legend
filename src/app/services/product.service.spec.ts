import { inject, TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('ProductService', () => {
  let TYPE: string;
  let ID: number;

  beforeEach(() => {
    TYPE = 'laptops';
    ID = 1;
    TestBed.configureTestingModule({
      providers: [ProductService],
      imports: [HttpClientTestingModule],
    });
  });

  it('should be created', inject(
    [ProductService],
    (service: ProductService) => {
      expect(service).toBeTruthy();
    }
  ));

  describe('getProducts', () => {
    it('should call http client with the correct url', inject(
      [ProductService, HttpTestingController],
      (service: ProductService, controller: HttpTestingController) => {
        // Arrange

        // Act
        service.getProducts(TYPE).subscribe();

        // Assert
        const req = controller.expectOne(`http://localhost:3000/${TYPE}`);

        expect(req.request.method).toEqual('GET');
        controller.verify();
        req.flush({ products: [] });
      }
    ));
  });

  describe('getProductWithBrand', () => {
    it('should call http client with the correct url', inject(
      [ProductService, HttpTestingController],
      (service: ProductService, controller: HttpTestingController) => {
        // Arrange

        // Act
        service.getProductWithBrand(TYPE, ID).subscribe();

        // Assert
        let req = controller.expectOne(`http://localhost:3000/${TYPE}/${ID}`);
        expect(req.request.method).toEqual('GET');
        req.flush({ product: {} });
        req = controller.expectOne(`http://localhost:3000/${TYPE}Brands`);
        expect(req.request.method).toEqual('GET');
        req.flush({ brand: {} });
        controller.verify();
      }
    ));
  });
});
