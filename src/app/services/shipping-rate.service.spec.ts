import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { ShippingRateService } from './shipping-rate.service';

describe('ShippingRateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShippingRateService],
      imports: [HttpClientTestingModule],
    });
  });

  describe('shippingRates$', () => {
    it('should call http client with the correct url', inject(
      [ShippingRateService, HttpTestingController],
      (service: ShippingRateService, controller: HttpTestingController) => {
        // Arrange

        // Act
        service.shippingRates$.subscribe();

        // Assert
        const req = controller.expectOne('http://localhost:3000/shipping');
        expect(req.request.method).toEqual('GET');
        controller.verify();
        req.flush({ data: [] });
      }
    ));
  });
});
