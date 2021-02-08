import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ProductService } from '../services/product.service';
import { IProduct } from '../types/product';
import { ProductResult } from '../types/product-result';

import { ProductResolverService } from './product-resolver.service';

describe('ProductResolverService', () => {
  let service: ProductResolverService;
  let mockProductService;
  let mockActivatedRouteSnapshot;
  let mockActivatedRouteSnapshotWithInvalidId;
  let PRODUCT: IProduct;

  beforeEach(() => {
    PRODUCT = {
      id: 31,
      name: 'Element',
      brandId: 1,
      description:
        'Prepare for battle with this iBUYPOWER Element gaming desktop. Featuring an NVIDIA GeForce GTX 1660 graphics card and a six-core Intel Core i7 processor, this PC smoothly runs resource-intensive titles at high settings. This iBUYPOWER Element gaming desktop starts up and loads games in seconds thanks to its 240GB solid-state drive.',
      price: 949.99,
      imageUrl: 'assets/images/element.jpg',
      imageUrls: [
        'assets/images/element.jpg',
        'assets/images/element(1).jpg',
        'assets/images/element(2).jpg',
      ],
      features: [
        {
          title: 'Windows 10 operating system',
          body:
            'Windows 10 brings back the Start Menu from Windows 7 and introduces new features, like the Edge Web browser that lets you markup Web pages on your screen.',
        },
        {
          title: '9th Gen Intel® Core™ i7-9700F processor',
          body: 'Powerful six-core, twelve-way processing performance.',
        },
        {
          title: '16GB system memory for intense multitasking and gaming',
          body:
            'Reams of high-bandwidth DDR4 RAM to smoothly run your graphics-heavy PC games and video-editing applications, as well as numerous programs and browser tabs all at once.',
        },
        {
          title:
            '2TB hard drive and 240GB solid state drive (SSD) for a blend of storage space and speed',
          body:
            'The hard drive provides ample storage, while the SSD delivers faster start-up times and data access.',
        },
        {
          title: 'NVIDIA GeForce GTX 1660 graphics',
          body:
            'Driven by 3GB GDDR5 dedicated video memory to quickly render high-quality images for videos and games.',
        },
        {
          title: '4 USB 3.0 ports maximize the latest high-speed devices',
          body:
            'Also includes 2 USB 2.0 ports to connect more accessories and peripherals. The USB 3.0 ports are backward-compatible with USB 2.0 devices (at 2.0 speeds).',
        },
        {
          title: 'Next-generation wireless connectivity',
          body:
            'Connects to your network or hotspots on all current Wi-Fi standards. Connect to a Wireless-AC router for speed nearly 3x faster than Wireless-N. Gigabit LAN port also plugs into wired networks.',
        },
      ],
      type: 'desktops',
      code: 'DDN-31',
      starRating: 2,
      brand: 'iBUYPOWER',
    };
    mockProductService = jasmine.createSpyObj(['getProductWithBrand']);
    mockActivatedRouteSnapshot = {
      paramMap: {
        get: (key: string) => {
          switch (key) {
            case 'type':
              return PRODUCT.type;
            case 'id':
              return PRODUCT.id;
          }
        },
      },
    };
    mockActivatedRouteSnapshotWithInvalidId = {
      paramMap: {
        get: (key: string) => {
          switch (key) {
            case 'type':
              return PRODUCT.type;
            case 'id':
              return 'invalid id';
          }
        },
      },
    };
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: ProductService, useValue: mockProductService }],
    });
    service = TestBed.inject(ProductResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('resolve', () => {
    it(`should call getProductWithBrand method on ProductService with correct
      values and return correct value`, () => {
      let productResult: ProductResult;
      mockProductService.getProductWithBrand.and.returnValue(of(PRODUCT));

      service
        .resolve(mockActivatedRouteSnapshot)
        .subscribe((r) => (productResult = r));

      expect(mockProductService.getProductWithBrand).toHaveBeenCalledWith(
        PRODUCT.type,
        +PRODUCT.id
      );
      expect(productResult).toEqual({
        product: PRODUCT,
      });
    });

    it(`should call getProductWithBrand method on ProductService with correct
      values and return correct value when
      ActivatedRouteSnapshot.paramMap.get('id') isNaN`, () => {
      let productResult: ProductResult;
      const id = mockActivatedRouteSnapshotWithInvalidId.paramMap.get('id');
      expect(+id).toBeNaN();
      mockProductService.getProductWithBrand.and.returnValue(of(PRODUCT));

      service
        .resolve(mockActivatedRouteSnapshotWithInvalidId)
        .subscribe((r) => (productResult = r));

      expect(mockProductService.getProductWithBrand).toHaveBeenCalledTimes(0);
      expect(productResult).toEqual({
        product: null,
        error: `Retrieval error: This product id is not a number: ${id}.`,
      });
    });

    it(`should call getProductWithBrand method on ProductService with correct
      values and return correct value when getProductWithBrand throws an
      error`, () => {
      let productResult: ProductResult;
      const error = 'TEST: getProductWithBrand error';
      mockProductService.getProductWithBrand.and.returnValue(throwError(error));

      service
        .resolve(mockActivatedRouteSnapshot)
        .subscribe((r) => (productResult = r));

      expect(mockProductService.getProductWithBrand).toHaveBeenCalledWith(
        PRODUCT.type,
        +PRODUCT.id
      );
      expect(productResult).toEqual({
        product: null,
        error: `Retrieval error: ${error}.`,
      });
    });
  });
});
