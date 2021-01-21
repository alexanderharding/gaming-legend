import { inject, TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProductBrandService } from './product-brand.service';
import { IProductBrand } from '../types/product-brand';
import { of } from 'rxjs';
import { IProduct } from '../types/product';

describe('ProductService', () => {
  let TYPE: string,
    ID: number,
    mockProductBrandService,
    BRANDS: IProductBrand[],
    PRODUCTS: IProduct[];

  beforeEach(() => {
    TYPE = 'laptops';
    ID = 1;
    BRANDS = [
      {
        id: 1,
        name: 'Lenovo',
        type: TYPE,
      },
      {
        id: 2,
        name: 'Samsung',
        type: TYPE,
      },
      {
        id: 3,
        name: 'Dell',
        type: TYPE,
      },
      {
        id: 4,
        name: 'Microsoft',
        type: TYPE,
      },
    ];
    PRODUCTS = [
      {
        id: 1,
        name: 'Ideapad L340',
        brandId: 1,
        description:
          "With the Lenovo Idea Pad L340 gaming Laptop, you know you've made the right decision with one serious laptop. Equipped with the latest Intel Core i5 processor, next-gen NVIDIA GeForce graphics, and jaw-dropping Dolby Audio, you'll experience first-hand real power and seamless play. You'll stay focused on the task at hand, concentrating on beating Your opponents and confident that your sleek, stylish computer will keep up with the competition.",
        price: 855.67,
        imageUrl: 'assets/images/ideapadL340.jpg',
        code: 'LDP-001',
        type: TYPE,
        starRating: 3,
      },
    ];
    mockProductBrandService = jasmine.createSpyObj(['getBrands']);
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        { provide: ProductBrandService, useValue: mockProductBrandService },
      ],
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

  xdescribe('getProductWithBrand', () => {
    it(`should call http client with the correct url and
      productBrandService.getBrands with correct value`, inject(
      [ProductService, HttpTestingController],
      (service: ProductService, controller: HttpTestingController) => {
        // Arrange
        mockProductBrandService.getBrands.and.returnValue(of(BRANDS));

        // Act
        service.getProductWithBrand(TYPE, ID).subscribe();

        // Assert
        let req = controller.expectOne(`http://localhost:3000/${TYPE}/${ID}`);
        expect(req.request.method).toEqual('GET');
        req.flush(PRODUCTS);
        expect(mockProductBrandService.getBrands).toHaveBeenCalledWith(TYPE);
        controller.verify();
      }
    ));
  });
});
